export class GoogleGenAI {
    constructor(_opts?: any) {}
    models = {
      generateContent: async (_args: any) => ({ candidates: [], text: '' }),
      generateImages: async (_args: any) => ({ generatedImages: [] }),
    };
    async generateContent(_args: any) { return { candidates: [], text: '' }; }
  }
  export const Modality = { TEXT: 'TEXT', IMAGE: 'IMAGE' } as const;
  