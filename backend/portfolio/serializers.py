from rest_framework import serializers
from django.db import transaction
from .models import Project, Category, ProjectImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProjectImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    image = serializers.ImageField(required=False)

    order = serializers.IntegerField(
        required=False,
        min_value=1,
    )

    delete = serializers.BooleanField(
        required=False,
        default=False,
    )

    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'order', 'delete']

    def validate(self, attrs):
        image_id = attrs.get('id')
        delete = attrs.get('delete', False)

        # در درخواست ایجاد پروژه، شناسه تصویر موجود پذیرفته نیست.
        is_update = getattr(self.root, 'instance', None) is not None

        if image_id is not None and not is_update:
            raise serializers.ValidationError({
                'id': 'Image IDs cannot be supplied when creating a project.'
            })

        # حذف تصویر موجود
        if delete:
            if not is_update or image_id is None:
                raise serializers.ValidationError({
                    'delete': 'Deleting an image requires an existing image ID.'
                })

            if 'image' in attrs:
                raise serializers.ValidationError({
                    'image': 'An image cannot be uploaded when deleting it.'
                })

            return attrs

        # ویرایش تصویر موجود
        if image_id is not None:
            if 'image' not in attrs and 'order' not in attrs:
                raise serializers.ValidationError(
                    'Provide an image or an order change.'
                )

            return attrs

        # ایجاد تصویر جدید: هر دو فیلد ضروری‌اند.
        errors = {}

        if 'image' not in attrs:
            errors['image'] = 'An image file is required.'

        if 'order' not in attrs:
            errors['order'] = 'An image order is required.'

        if errors:
            raise serializers.ValidationError(errors)

        return attrs
    
class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(
        many=True,
        required=False
    )

    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all(),
        source='categories',
        write_only=True
    )

    categories = CategorySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'categories',
            'category_ids',
            'link',
            'images'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        categories_data = validated_data.pop('categories', [])

        with transaction.atomic():
            project = Project.objects.create(**validated_data)

            project.categories.set(categories_data)

            for image_data in images_data:
                ProjectImage.objects.create(
                    project=project,
                    image=image_data['image'],
                    order=image_data['order']
                )

        return project

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        categories_data = validated_data.pop('categories', None)

        with transaction.atomic():

            instance.title = validated_data.get(
                'title',
                instance.title
            )

            instance.description = validated_data.get(
                'description',
                instance.description
            )

            instance.link = validated_data.get(
                'link',
                instance.link
            )

            if categories_data is not None:
                instance.categories.set(categories_data)

            for image_data in images_data:

                image_id = image_data.get('id')

                # Existing image
                if image_id:

                    try:
                        project_image = ProjectImage.objects.get(
                            id=image_id,
                            project=instance
                        )

                    except ProjectImage.DoesNotExist:
                        raise serializers.ValidationError(
                            f'Image with id {image_id} '
                            f'does not exist for this project.'
                        )

                    # Delete image
                    if image_data.get('delete'):
                        project_image.delete()

                    # Update image
                    else:
                        if 'order' in image_data:
                            project_image.order = image_data['order']

                        if 'image' in image_data:
                            project_image.image = image_data['image']

                        project_image.save()

                # New image
                else:
                    ProjectImage.objects.create(
                        project=instance,
                        image=image_data['image'],
                        order=image_data['order']
                    )

            instance.save()

        return instance

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                'Title must be at least 5 characters.'
            )

        return value

    def validate_description(self, value):
        if 'spam' in value.lower():
            raise serializers.ValidationError(
                'Description contains forbidden content.'
            )

        return value
    def validate(self, attrs):
        link = attrs.get(
            'link',
            getattr(self.instance, 'link', ''),
        )

        description = attrs.get(
            'description',
            getattr(self.instance, 'description', ''),
        )

        if not link and len(description) < 20:
            raise serializers.ValidationError(
                'If link is empty, description must be at least 20 characters.'
            )

        images_data = attrs.get('images', [])

        if self.instance is None:
            # هنگام ایجاد پروژه، ترتیب تصاویر ورودی باید یکتا باشد.
            final_orders = [
                image_data['order']
                for image_data in images_data
                if not image_data.get('delete', False)
                and 'order' in image_data
            ]

        else:
            # ترتیب تصاویر فعلی پروژه را در نظر می‌گیریم.
            existing_orders = {
                image.pk: image.order
                for image in self.instance.images.all()
            }

            new_orders = []

            for image_data in images_data:
                image_id = image_data.get('id')

                if image_data.get('delete', False):
                    existing_orders.pop(image_id, None)

                elif image_id is not None:
                    if (
                        image_id in existing_orders
                        and 'order' in image_data
                    ):
                        existing_orders[image_id] = image_data['order']

                elif 'order' in image_data:
                    new_orders.append(image_data['order'])

            final_orders = list(existing_orders.values()) + new_orders

        if len(final_orders) != len(set(final_orders)):
            raise serializers.ValidationError({
                'images': 'Image order values must be unique within a project.'
            })

        return attrs
    