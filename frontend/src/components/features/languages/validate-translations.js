#!/usr/bin/env node

/**
 * Script para validar que todos los archivos de traducción
 * tienen la misma estructura de claves
 * 
 * Uso: node validate-translations.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['es', 'en', 'pt', 'pt_BR', 'ru'];
const LANG_DIR = __dirname;

function getKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  console.log('🔍 Validando traducciones...\n');

  const translations = {};
  const allKeys = new Set();

  // Cargar todos los archivos
  LANGUAGES.forEach((lang) => {
    const filePath = path.join(LANG_DIR, `${lang}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      translations[lang] = JSON.parse(content);
      const keys = getKeys(translations[lang]);
      keys.forEach((key) => allKeys.add(key));
      console.log(`✅ ${lang}: ${keys.length} keys loaded`);
    } catch (error) {
      console.error(`❌ Error loading ${lang}.json:`, error.message);
      process.exit(1);
    }
  });

  console.log(`\n📊 Total unique keys: ${allKeys.size}\n`);

  // Verificar que todos los idiomas tienen todas las claves
  let hasErrors = false;
  const sortedKeys = Array.from(allKeys).sort();

  sortedKeys.forEach((key) => {
    const missingIn = LANGUAGES.filter((lang) => {
      const keys = getKeys(translations[lang]);
      return !keys.includes(key);
    });

    if (missingIn.length > 0) {
      console.error(`❌ Key "${key}" is missing in: ${missingIn.join(', ')}`);
      hasErrors = true;
    }
  });

  if (!hasErrors) {
    console.log('✅ All translations have the same structure!\n');
    console.log('Language statistics:');
    LANGUAGES.forEach((lang) => {
      const keys = getKeys(translations[lang]);
      console.log(`  ${lang}: ${keys.length} translations`);
    });
  } else {
    console.log('\n❌ There are missing translations. Please fix them above.');
    process.exit(1);
  }
}

validateTranslations();
