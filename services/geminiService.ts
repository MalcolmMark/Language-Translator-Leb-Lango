
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPrompt = (text: string, sourceLang: Language, targetLang: Language): string => {
    if (sourceLang === Language.EN && targetLang === Language.LEB) {
        return `
            You are an expert translator. Your task is to translate English text into a fictional language called 'Leb Lango'.
            The rule for Leb Lango is: for each word, move the first letter to the end of the word and then append the suffix 'leb'.
            Maintain original capitalization of the moved letter and punctuation placement.

            Example 1:
            English: Hello world!
            Leb Lango: elloHleb orldwleb!

            Example 2:
            English: This is a Fun-Game.
            Leb Lango: hisTleb siay a unFleb-ameGleb.

            Now, translate the following text to Leb Lango:
            "${text}"
        `;
    } else if (sourceLang === Language.LEB && targetLang === Language.EN) {
        return `
            You are an expert translator. Your task is to translate text from a fictional language called 'Leb Lango' back into English.
            The rule for creating Leb Lango was: for each word, the first letter was moved to the end, and the suffix 'leb' was appended.
            To reverse this, for each word, you must remove the 'leb' suffix, then take the last letter of the remaining word and move it to the front.
            Maintain original capitalization of the moved letter and punctuation placement.

            Example 1:
            Leb Lango: elloHleb orldwleb!
            English: Hello world!
            
            Example 2:
            Leb Lango: hisTleb siay a unFleb-ameGleb.
            English: This is a Fun-Game.

            Now, translate the following text back to English:
            "${text}"
        `;
    }
    return text;
};


export const translate = async (text: string, sourceLang: Language, targetLang: Language): Promise<string> => {
    if (sourceLang === targetLang) {
        return text;
    }

    try {
        const prompt = getPrompt(text, sourceLang, targetLang);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error translating with Gemini API:", error);
        throw new Error("Translation failed");
    }
};
