from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APITestCase

from portfolio.models import Project ,ProjectImage
from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from portfolio.serializers import ProjectSerializer


class PortfolioPermissionTests(APITestCase):

    def setUp(self):
        # ساخت مالک پروژه
        self.owner = User.objects.create_user(
            username='project_owner',
            email='owner@example.com',
            password='Owner-Strong-Password_2026!',
        )

        # ساخت کاربر دیگر
        self.other_user = User.objects.create_user(
            username='other_user',
            email='other@example.com',
            password='Other-Strong-Password_2026!',
        )

        # ساخت پروژه متعلق به مالک
        self.project = Project.objects.create(
            title='Existing Project',
            description='This is a sufficiently long project description.',
            link='https://example.com',
            author=self.owner,
        )

        self.list_url = '/portfolio/projects/'

        self.detail_url = (
            f'/portfolio/projects/{self.project.pk}/'
        )

    def valid_project_payload(self):
        return {
            'title': 'New Test Project',
            'description': (
                'This description is long enough for the project.'
            ),
            'link': 'https://example.com',
            'category_ids': [],
        }

    def test_anonymous_user_can_view_projects(self):
        """
        کاربران ناشناس باید بتوانند پروژه‌های عمومی را ببینند.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_anonymous_user_cannot_create_project(self):
        """
        کاربر ناشناس نباید بتواند پروژه ایجاد کند.
        """
        response = self.client.post(
            self.list_url,
            self.valid_project_payload(),
            format='json',
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

        self.assertEqual(Project.objects.count(), 1)

    def test_authenticated_user_becomes_project_author(self):
        """
        مالک پروژه باید توسط بک‌اند تعیین شود.
        """
        self.client.force_authenticate(
            user=self.owner,
        )

        response = self.client.post(
            self.list_url,
            self.valid_project_payload(),
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        created_project = Project.objects.get(
            title='New Test Project',
        )

        self.assertEqual(
            created_project.author,
            self.owner,
        )

    def test_create_project_rejects_image_without_file(self):
        """
        ایجاد پروژه با تصویر ناقص باید با خطای اعتبارسنجی رد شود.
        """
        self.client.force_authenticate(
            user=self.owner,
        )

        payload = self.valid_project_payload()
        payload['images'] = [
            {
                'order': 1,
            }
        ]

        response = self.client.post(
            self.list_url,
            payload,
            format='json',
        )

        # تصویر جدید بدون فایل نباید پذیرفته شود.
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        # پروژه ناقص نباید در دیتابیس ایجاد شده باشد.
        self.assertEqual(
            Project.objects.count(),
            1,
        )

    def test_non_owner_cannot_update_project(self):
        """
        کاربر دیگر نباید بتواند پروژه را ویرایش کند.
        """
        self.client.force_authenticate(
            user=self.other_user,
        )

        response = self.client.patch(
            self.detail_url,
            {
                'title': 'Modified By Another User',
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.project.refresh_from_db()

        self.assertEqual(
            self.project.title,
            'Existing Project',
        )

    def test_non_owner_cannot_delete_project(self):
        """
        کاربر دیگر نباید بتواند پروژه را حذف کند.
        """
        self.client.force_authenticate(
            user=self.other_user,
        )

        response = self.client.delete(
            self.detail_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.assertTrue(
            Project.objects.filter(
                pk=self.project.pk,
            ).exists()
        )

    def test_owner_can_update_project(self):
        """
        مالک باید بتواند پروژه خودش را ویرایش کند.
        """
        self.client.force_authenticate(
            user=self.owner,
        )

        response = self.client.patch(
            self.detail_url,
            {
                'title': 'Updated Project Title',
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.project.refresh_from_db()

        self.assertEqual(
            self.project.title,
            'Updated Project Title',
        )

    def test_owner_can_delete_project(self):
        """
        مالک باید بتواند پروژه خودش را حذف کند.
        """
        self.client.force_authenticate(
            user=self.owner,
        )

        response = self.client.delete(
            self.detail_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Project.objects.filter(
                pk=self.project.pk,
            ).exists()
        )

    def test_owner_cannot_delete_image_from_another_project(self):
        # ساخت پروژه متعلق به کاربر دوم
        other_project = Project.objects.create(
            title='Other Existing Project',
            description=(
                'This is another sufficiently long project description.'
            ),
            link='https://example.org',
            author=self.other_user,
        )

        # ساخت تصویر متعلق به پروژه کاربر دوم
        other_image = ProjectImage.objects.create(
            project=other_project,
            image='projects/other.png',
            order=1,
        )

        # مالک پروژه اول تلاش می‌کند تصویر پروژه دوم را حذف کند.
        self.client.force_authenticate(
            user=self.owner,
        )

        response = self.client.patch(
            self.detail_url,
            {
                'images': [
                    {
                        'id': other_image.pk,
                        'order': 1,
                        'delete': True,
                    }
                ]
            },
            format='json',
        )

        # درخواست باید رد شود.
        self.assertEqual(
            response.status_code,
            400,
        )

        # تصویر پروژه دوم باید همچنان در دیتابیس وجود داشته باشد.
        self.assertTrue(
            ProjectImage.objects.filter(
                pk=other_image.pk,
                project=other_project,
            ).exists()
        )

    def test_project_serializer_rejects_duplicate_image_orders(self):
        def create_test_image(filename):
            buffer = BytesIO()

            Image.new(
                'RGB',
                (1, 1),
                color='white',
            ).save(buffer, format='PNG')

            buffer.seek(0)

            return SimpleUploadedFile(
                filename,
                buffer.read(),
                content_type='image/png',
            )

        serializer = ProjectSerializer(
            data={
                'title': 'Duplicate Order Project',
                'description': (
                    'This description is long enough for the project.'
                ),
                'link': 'https://example.com',
                'category_ids': [],
                'images': [
                    {
                        'image': create_test_image('first.png'),
                        'order': 1,
                    },
                    {
                        'image': create_test_image('second.png'),
                        'order': 1,
                    },
                ],
            }
        )

        self.assertFalse(serializer.is_valid())

        self.assertIn('images', serializer.errors)


