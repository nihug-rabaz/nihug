import Image from "next/image";

export default function PortalContact() {
  return (
    <section id="contact" className="portal-contact" aria-labelledby="portal-contact-title">
      <div className="portal-contact__inner">
        <div className="portal-contact__brands">
          <div className="portal-contact__brand">
            <Image
              src="/logo-rabbanut.png"
              alt="סמל הרבנות הצבאית"
              width={56}
              height={56}
              className="portal-contact__logo"
            />
            <span className="portal-contact__brand-label">רבנות צבאית</span>
          </div>
          <div className="portal-contact__brand">
            <Image
              src="/logo-nihug.png"
              alt="סמל תחום ניהו״ג"
              width={56}
              height={56}
              className="portal-contact__logo"
            />
            <span className="portal-contact__brand-label">תחום ניהו״ג</span>
          </div>
        </div>
        <h2 id="portal-contact-title" className="portal-contact__title">
          יצירת קשר
        </h2>
        <p className="portal-contact__lead">תמיכה ופניות לתחום ניהול הידע והמערכות</p>
        <ul className="portal-contact__list">
          <li>
            <span className="portal-contact__label">טלפון</span>
            <a href="tel:+972732432211">073-243-2211</a>
          </li>
          <li>
            <span className="portal-contact__label">דוא״ל</span>
            <a href="mailto:r0672madornihul@army.idf.il">r0672madornihul@army.idf.il</a>
          </li>
          <li>
            <span className="portal-contact__label">מיקום</span>
            <span>מטכ״ל 2211</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
