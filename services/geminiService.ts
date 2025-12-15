import { GoogleGenAI } from "@google/genai";
import { Campaign } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCampaigns = async (campaigns: Campaign[]): Promise<string> => {
  try {
    const dataString = JSON.stringify(campaigns.map(c => ({
      name: c.name,
      status: c.status,
      spend: c.spend,
      revenue: c.revenue,
      acos: c.acos,
      roas: c.roas,
      clicks: c.clicks,
      impressions: c.impressions
    })), null, 2);

    const prompt = `
      Atue como um especialista sênior em Mercado Ads (Mercado Livre).
      Analise os seguintes dados de campanha em JSON:
      ${dataString}

      Forneça uma análise estratégica em formato Markdown.
      1. Identifique as "Estrelas" (Alto ROAS, Baixo ACOS).
      2. Identifique os "Sangramentos" (Alto Gasto, Alto ACOS > 30%, Baixo Retorno).
      3. Identifique campanhas "Estagnadas" (Muitas impressões, poucos cliques/vendas).
      4. Sugira 3 ações concretas e imediatas para melhorar a rentabilidade geral da conta.
      
      Seja direto, profissional e use formatação rica (negrito, listas). Fale em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Ocorreu um erro ao conectar com a IA para análise. Verifique sua chave API.";
  }
};