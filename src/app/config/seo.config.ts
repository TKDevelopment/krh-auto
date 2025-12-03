import { SeoMetaOptions } from "../services/seo.service";

const BASE_URL = 'https://krhautobody.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/krh-og-default.jpg`;

export const HOME_SEO: SeoMetaOptions = {
  title: 'KRH Auto Body & Mechanic – Premier Collision Repair in Northern Rhode Island & Providence',
  description:
    'KRH Auto Body provides premier collision repair, auto body paint, frame straightening, and full-service mechanical repairs for drivers in Northern Rhode Island and Providence.',
  keywords: [
    'auto body northern rhode island',
    'auto body providence ri',
    'collision repair northern ri',
    'collision repair providence',
    'auto body shop north kingstown',
    'paint and bodywork ri',
    'auto mechanic northern rhode island',
    'auto mechanic providence ri',
    'frame repair ri',
    'dent repair ri',
    'krh auto body',
  ].join(', '),
  ogImage: DEFAULT_OG_IMAGE,
  url: BASE_URL,
};

export const SERVICES_SEO: SeoMetaOptions = {
  title: 'Auto Body & Mechanic Services – Collision, Paint & Repair | KRH Auto Rhode Island',
  description:
    'Explore KRH Auto’s premier services for Northern Rhode Island and Providence: collision repair, paint and refinishing, frame straightening, dent removal, diagnostics, and full-service mechanical repairs.',
  keywords: [
    'auto body services northern ri',
    'auto mechanic services providence ri',
    'collision repair services ri',
    'auto paint shop northern rhode island',
    'dent removal providence',
    'ceramic coating northern ri',
    'mechanic shop providence',
  ].join(', '),
  ogImage: DEFAULT_OG_IMAGE,
  url: `${BASE_URL}/services`,
};

export const ABOUT_SEO: SeoMetaOptions = {
  title: 'About KRH Auto – Local Premier Auto Body & Mechanic in Northern Rhode Island',
  description:
    'Learn about KRH Auto Body, a locally owned premier auto body and mechanic shop proudly serving Northern Rhode Island and Providence with honest diagnostics, quality repairs, and meticulous paint work.',
  keywords: [
    'about krh auto',
    'local auto body shop northern ri',
    'trusted mechanic providence ri',
    'family owned auto body rhode island',
  ].join(', '),
  ogImage: DEFAULT_OG_IMAGE,
  url: `${BASE_URL}/about`,
};

export const CONTACT_SEO: SeoMetaOptions = {
  title: 'Contact KRH Auto – Schedule Collision Repair or Auto Service in Northern RI & Providence',
  description:
    'Request an estimate or schedule service with KRH Auto Body. Conveniently serving Northern Rhode Island and Providence with premier auto body and mechanic services.',
  keywords: [
    'contact krh auto',
    'schedule auto body northern ri',
    'book collision repair providence',
    'auto repair estimate northern rhode island',
  ].join(', '),
  ogImage: DEFAULT_OG_IMAGE,
  url: `${BASE_URL}/contact`,
};
