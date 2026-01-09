// src/constants/templates.ts

export interface TemplateStyle {
  container: string;
  font: string;
  fontColor: string;
  imageLayout: string;
  contentAlign: string;
  padding: string;
  titleSize: string;
}

export const TEMPLATE_CONFIG: Record<string, TemplateStyle> = {
  default: {
    container: "bg-white",
    font: "font-sans",
    fontColor: "text-gray-900",
    imageLayout: "w-full aspect-auto object-contain mb-0 border-none",
    contentAlign: "text-left",
    padding: "p-0",
    titleSize: "text-3xl",
  },
  classic: {
    container: "bg-[#f4f1ea]",
    font: "font-serif",
    fontColor: "text-[#2c2c2c]",
    imageLayout: "w-[85%] mx-auto my-12 shadow-2xl border-[15px] border-white ring-1 ring-black/5",
    contentAlign: "text-center",
    padding: "p-12",
    titleSize: "text-4xl",
  },
  art: {
    container: "bg-[#f4f1ea]",
    font: "font-serif",
    fontColor: "text-[#2c2c2c]",
    imageLayout: "w-[85%] mx-auto my-12 shadow-2xl border-[15px] border-white ring-1 ring-black/5",
    contentAlign: "text-center",
    padding: "p-12",
    titleSize: "text-4xl",
  },

  // 나중에 여기에 'modern', 'art' 등을 추가하기만 하면 끝!
};
