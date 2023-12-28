declare module 'html2pdf.js' {
    const html2pdf: {
      (): {
        from: (element: HTMLElement) => {
          set: (options: any) => {
            outputPdf: () => Promise<any>;
          };
        };
      };
    };
  
    export default html2pdf;
  }
  