import type {
  buttonStyle,
  ctaBtnStyle as CtaButtonStyle,
  ctaPStyle as ctaPStyleBtn,
  ctaStyle,
  subTitleStyle as TypeSubTitleStyle,
  titleStyle as TypeTitleStyle,
} from '@/@types/embed';
import type { CSSProperties } from 'react';

export const divStyle = (cta: ctaStyle): CSSProperties => {
  return {
    top: `${cta.ctaTop}%`,
    left: `${cta.ctaLeft}%`,
  };
};

export const pStyle = (cta: ctaStyle): CSSProperties => {
  return {
    textAlign: cta.alignment as CSSProperties['textAlign'],
    fontWeight: cta.textStyle === 'bold' ? '800' : cta.textStyle === 'normal' ? '500' : '400',
    fontStyle: cta.textStyle === 'italic' ? 'italic' : 'normal',
    color: cta.textColor,
    overflowWrap: 'break-word',
  };
};

export const btnStyle = (cta: ctaStyle): CSSProperties => {
  return {
    backgroundColor: cta.buttonColor,
    color: cta.buttonTextColor,
    borderRadius: `${cta.borderRadius}px`,
  };
};

export const btnEdgeStyle = (btn: buttonStyle): CSSProperties => {
  return {
    backgroundColor: btn.backgroundColor,
    color: btn.textColor,
    borderRadius: `${btn.borderRadius}px`,
    top: `${btn.btnTop}%`,
    left: `${btn.btnLeft}%`,
  };
};

export const titleStyle = (title: TypeTitleStyle): CSSProperties => {
  return {
    fontWeight: title.estiloHL === 'bold' ? '800' : title.estiloHL === 'normal' ? '600' : '500',
    color: title.corHL,
    fontStyle: title.estiloHL === 'italic' ? 'italic' : 'normal',
  };
};

export const subTitleStyle = (subTitle: TypeSubTitleStyle): CSSProperties => {
  return {
    textAlign: subTitle.alinhamentoSHL as CSSProperties['textAlign'],
    fontWeight: subTitle.estiloSHL === 'bold' ? '800' : subTitle.estiloSHL === 'normal' ? '600' : '500',
    color: subTitle.corSHL,
    fontStyle: subTitle.estiloSHL === 'italic' ? 'italic' : 'normal',
  };
};

export const ctaPStyle = (cta: ctaPStyleBtn): CSSProperties => {
  return {
    textAlign: cta.alinhamentoCta as CSSProperties['textAlign'],
    fontWeight: cta.styleCta === 'bold' ? '800' : cta.styleCta === 'normal' ? '600' : '500',
    fontStyle: cta.estiloCta === 'italic' ? 'italic' : 'normal',
    color: cta.corCta,
  };
};

export const ctaBtnStyle = (cta: CtaButtonStyle): CSSProperties => {
  return {
    backgroundColor: cta.corBG,
    color: cta.corTX,
    borderRadius: `${cta.borderRadius}px`,
  };
};
