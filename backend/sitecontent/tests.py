from django.test import TestCase

# Create your tests here.
from django.core.cache import cache

from rest_framework import status
from rest_framework.test import APITestCase

from sitecontent.models import HomeStat, Client, Testimonial


class HomeStatsAPITests(APITestCase):
    def setUp(self):
        HomeStat.objects.create(
            key='developers',
            value=30,
            plus=True,
            order=2,
        )

        HomeStat.objects.create(
            key='projects-delivered',
            value=384,
            plus=True,
            order=1,
        )

    def test_home_stats_are_returned_in_order(self):
        response = self.client.get('/api/home-stats/')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            2,
        )

        self.assertEqual(
            response.data[0]['key'],
            'projects-delivered',
        )

        self.assertEqual(
            response.data[1]['key'],
            'developers',
        )


class CustomerMapAPITests(APITestCase):
    def setUp(self):
        cache.clear()

        self.valid_payload = {
            'display_name': 'Test Client',
            'contact_email': 'client@example.com',
            'company': 'Example Studio',
            'country': 'Germany',
            'city': 'Berlin',
            'text': 'Working with the team was a great experience.',
            'publication_consent': True,
        }

    def tearDown(self):
        cache.clear()

    def test_submission_creates_unapproved_testimonial(self):
        """
        نظر جدید باید ذخیره شود اما خودکار منتشر نشود.
        """
        response = self.client.post(
            '/api/testimonials/submit/',
            self.valid_payload,
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(Client.objects.count(), 1)
        self.assertEqual(Testimonial.objects.count(), 1)

        client = Client.objects.get(
            contact_email='client@example.com',
        )

        testimonial = Testimonial.objects.get(client=client)

        self.assertFalse(client.is_approved)
        self.assertFalse(client.show_on_map)
        self.assertFalse(testimonial.is_approved)

        # ایمیل خصوصی نباید در پاسخ عمومی ثبت نظر برگردد.
        self.assertNotIn(
            'contact_email',
            response.data,
        )

    def test_invalid_email_is_rejected(self):
        """
        ایمیل نامعتبر نباید ثبت شود.
        """
        payload = {
            **self.valid_payload,
            'contact_email': 'not-an-email',
        }

        response = self.client.post(
            '/api/testimonials/submit/',
            payload,
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(Client.objects.count(), 0)
        self.assertEqual(Testimonial.objects.count(), 0)

    def test_customer_map_exposes_only_approved_public_data(self):
        """
        فقط مشتریان و نظرات تأییدشده و مجاز باید نمایش داده شوند.
        """
        visible_client = Client.objects.create(
            display_name='Visible Client',
            contact_email='visible@example.com',
            company='Visible Studio',
            country='Germany',
            city='Berlin',
            map_x=62,
            map_y=38,
            publication_consent=True,
            is_approved=True,
            show_on_map=True,
        )

        visible_testimonial = Testimonial.objects.create(
            client=visible_client,
            text='The collaboration was excellent.',
            publication_consent=True,
            is_approved=True,
        )

        # مشتری تأییدنشده نباید در پاسخ عمومی دیده شود.
        hidden_client = Client.objects.create(
            display_name='Hidden Client',
            contact_email='hidden@example.com',
            country='France',
            map_x=40,
            map_y=50,
            publication_consent=True,
            is_approved=False,
            show_on_map=True,
        )

        # نظر تأییدنشده نباید در پاسخ عمومی دیده شود.
        Testimonial.objects.create(
            client=visible_client,
            text='This review has not been approved.',
            publication_consent=True,
            is_approved=False,
        )

        response = self.client.get('/api/customer-map/')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            [item['id'] for item in response.data['clients']],
            [visible_client.id],
        )

        self.assertEqual(
            [
                item['id']
                for item in response.data['testimonials']
            ],
            [visible_testimonial.id],
        )

        # اطلاعات تماس خصوصی نباید به بیرون نشت کند.
        self.assertNotIn(
            'contact_email',
            response.data['clients'][0],
        )

        self.assertNotIn(
            'contact_email',
            response.data['testimonials'][0]['client'],
        )

        self.assertNotIn(
            hidden_client.id,
            [
                item['id']
                for item in response.data['clients']
            ],
        )

    def test_testimonial_submission_is_rate_limited(self):
        """
        پس از سه درخواست در ساعت، درخواست چهارم باید رد شود.
        """
        url = '/api/testimonials/submit/'

        for index in range(3):
            payload = {
                **self.valid_payload,
                'contact_email': f'client{index}@example.com',
            }

            response = self.client.post(
                url,
                payload,
                format='json',
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED,
            )

        payload = {
            **self.valid_payload,
            'contact_email': 'fourth@example.com',
        }

        response = self.client.post(
            url,
            payload,
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )