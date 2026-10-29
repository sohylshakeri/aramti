
# معماری پروژه‌ی سایت Aramti

**نسخه:** ۱.۱  
**نوع پروژه:** سایت شرکتی React + Vite، چندزبانه و آماده‌ی لایه‌ی موبایل

## فلسفه‌ی اصلی

این پروژه عمداً از یک معماری سبک و Feature-based استفاده می‌کند، نه Clean Architecture
سنگین. هر صفحه مالک بخش‌ها، رفتارها و کامپوننت‌های مخصوص خودش است و فقط اجزایی که واقعاً
در چند صفحه استفاده می‌شوند وارد `components/` مشترک می‌شوند.

### قانون طلایی

> هر قابلیت و هر بخش UI فقط یک‌بار پیاده‌سازی می‌شود. زبان، RTL و موبایل به‌شکل لایه‌های
> نازک روی همان پیاده‌سازی قرار می‌گیرند.

## ساختار فعلی

```text
src/
  app/
    App.jsx
    router.jsx
    i18n.jsx
    auth/
      AuthContext.jsx

  pages/
    home/
      HomePage.jsx
      components/
        HeroSection.jsx
        HeroIllustration.jsx
        ServicesSection.jsx
        ServiceCard.jsx
        HighlightsSection.jsx
        HighlightCard.jsx
        WhyUsSection.jsx
        CustomerMapSection.jsx
        CustomerMapMarker.jsx
        CustomerReviewCard.jsx
        WorldMap.jsx
        HomeCtaSection.jsx
        highlights/

    about/
      AboutPage.jsx
      components/
        AboutHeroSection.jsx
        JourneySection.jsx
        TeamSection.jsx

    contact/
      ContactPage.jsx
      components/
        ContactSection.jsx
        ContactInfo.jsx
        ContactForm.jsx
      services/
        contactApi.js

    portfolio/
      PortfolioPage.jsx
      components/
        PortfolioSection.jsx
        PortfolioCard.jsx
      services/
        portfolioApi.js

    auth/
      LoginPage.jsx
      SignupPage.jsx
      VerificationPage.jsx
      ForgotPasswordPage.jsx
      AuthCallbackPage.jsx
      components/
        AuthLayout.jsx
        AuthVisual.jsx
        AuthField.jsx
        AuthSocials.jsx
        AuthSwitchLink.jsx
      services/
        authApi.js

  components/
    layout/
      Header.jsx
      Footer.jsx
    ui/
      LanguageToggle.jsx
      LanguageSwitcher.jsx
      Logo.jsx
      PageHero.jsx
      ScaleWrapper.jsx
      UserAvatar.jsx

  content/
    common.js
    home.js
    about.js
    contact.js
    portfolio.js
    auth.js

  locales/
    en/
    fa/

  hooks/
    useMediaQuery.js

  styles/
    index.css
    rtl.css
    mobile.css

  assets/
    icons/
    illustrations/
    fonts/
```

## مسئولیت لایه‌ها

- `Page.jsx`: فقط ترتیب بخش‌های صفحه را مشخص می‌کند.
- `pages/<page>/components`: JSX و منطق مخصوص همان صفحه.
- `components/layout`: اسکلت سراسری سایت.
- `components/ui`: اجزای کوچک و واقعاً قابل‌استفاده در چند صفحه.
- `content`: آرایه‌ها، شناسه‌ها، مسیرها و داده‌ی ساختاریافته؛ بدون متن ترجمه‌شده.
- `locales`: تمام متن‌های قابل‌مشاهده برای کاربر.
- `index.css`: طراحی مرجع دسکتاپ.
- `app/auth/AuthContext.jsx`: وضعیت سراسری احراز هویت و اتصال Header به نشست کاربر.
- `pages/auth/services/authApi.js`: مرز واحد فرانت‌اند برای APIهای Django Auth/OAuth.
- `rtl.css`: فقط overrideهای جهت.
- `mobile.css`: فقط overrideهای چیدمان موبایل.

## قوانین توسعه

1. متن قابل‌مشاهده مستقیماً در JSX نوشته نمی‌شود و از `t('key')` می‌آید.
2. آرایه‌ها و داده‌های ساختاریافته داخل `content/` قرار می‌گیرند.
3. منطق مخصوص یک بخش باید کنار همان بخش باشد، نه داخل فایل ورودی صفحه.
4. یک کامپوننت فقط زمانی وارد `components/ui` می‌شود که در چند صفحه کاربرد واقعی داشته باشد.
5. تفاوت فارسی/انگلیسی با فایل کامپوننت جدا حل نمی‌شود.
6. تفاوت موبایل/دسکتاپ ابتدا با `mobile.css` حل می‌شود.
7. رنگ‌ها و سایه‌های تکرارشونده از متغیرهای `:root` استفاده می‌کنند.
8. سرویس API فقط زمانی ساخته می‌شود که آن صفحه واقعاً اتصال داده یا بک‌اند داشته باشد.

## بخش نقشه‌ی مشتریان

`CustomerMapSection.jsx` مالک کامل رفتار نقشه است:

- فیلتر نقاط سفید و آبی
- انتخاب دستی نظر از روی نقطه‌ی آبی
- نمایش دو نظر تصادفی
- تعویض خودکار هر ۱۰ ثانیه
- توقف تعویض خودکار هنگام انتخاب دستی

قابلیت آزمایشی بزرگ‌کردن و Pin کارت حذف شده تا رفتار بخش ساده، پایدار و قابل نگهداری بماند.


## احراز هویت

UI و state احراز هویت در فرانت‌اند پیاده شده‌اند و Backend از طریق `authApi.js` جایگزین‌پذیر است.
صفحات Login / Sign Up / Verification / Forgot Password از یک `AuthLayout` و اجزای مشترک استفاده
می‌کنند. اطلاعات قرارداد مورد انتظار Django در `AUTH_BACKEND_CONTRACT.md` ثبت شده است.

Secretهای Google/Facebook/Apple هرگز در فرانت‌اند یا فایل‌های Vite قرار نمی‌گیرند.
