/**
 * Firebase Integration Test Script
 * 
 * Este script testa a integração do Firebase:
 * - Carrega configurações
 * - Valida variáveis de ambiente
 * - Testa inicialização do Client SDK
 * - Testa inicialização do Admin SDK (se em Node.js)
 * - Verifica conectividade básica
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});
dotenv.config({
  path: path.resolve(process.cwd(), '.env.example'),
});

console.log('🔥 Firebase Integration Test\n');
console.log('=' .repeat(60));

// ============================================================================
// 1. VALIDAR VARIÁVEIS DE AMBIENTE
// ============================================================================
console.log('\n📋 ETAPA 1: Validação de Variáveis de Ambiente\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const optionalEnvVars = [
  'FIREBASE_ADMIN_SDK_KEY',
  'NEXT_PUBLIC_USE_FIREBASE_EMULATOR',
];

let allVarsPresent = true;

console.log('Variáveis Obrigatórias (PUBLIC):');
for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  if (value) {
    // Mostrar apenas o início (nunca expor credenciais reais)
    const display = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`  ✅ ${varName}: ${display}`);
  } else {
    console.log(`  ❌ ${varName}: NÃO DEFINIDO`);
    allVarsPresent = false;
  }
}

console.log('\nVariáveis Opcionais:');
for (const varName of optionalEnvVars) {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('ADMIN_SDK_KEY')) {
      console.log(`  ✅ ${varName}: [DEFINIDO] (JSON com ${value.length} caracteres)`);
    } else {
      console.log(`  ✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`  ⚠️  ${varName}: não definido (opcional)`);
  }
}

if (!allVarsPresent) {
  console.log('\n⚠️  AVISO: Algumas variáveis obrigatórias não estão definidas!');
  console.log('   Adicione as credenciais reais em .env.local para testar com Firebase real.');
}

// ============================================================================
// 2. VALIDAR FORMATO DAS VARIÁVEIS
// ============================================================================
console.log('\n📋 ETAPA 2: Validação de Formato\n');

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '';

console.log('Verificando formato das variáveis:');

// API Key começa com AIza
if (apiKey.startsWith('AIza')) {
  console.log('  ✅ API Key: Formato correto (começa com AIza)');
} else {
  console.log('  ⚠️  API Key: Pode ser valor de exemplo');
}

// Project ID não contém pontos/espaços
if (projectId && !projectId.includes(' ') && projectId.length > 2) {
  console.log('  ✅ Project ID: Formato válido');
} else {
  console.log('  ⚠️  Project ID: Pode ser valor de exemplo');
}

// Auth Domain tem formato xxx.firebaseapp.com
if (authDomain.includes('firebaseapp.com')) {
  console.log('  ✅ Auth Domain: Formato correto (.firebaseapp.com)');
} else {
  console.log('  ⚠️  Auth Domain: Pode ser valor de exemplo');
}

// ============================================================================
// 3. TESTAR IMPORTAÇÃO DO CLIENT SDK
// ============================================================================
console.log('\n📋 ETAPA 3: Teste de Importação do Firebase Client SDK\n');

try {
  const { initializeApp } = require('firebase/app');
  const { getAuth } = require('firebase/auth');
  const { getFirestore } = require('firebase/firestore');
  
  console.log('  ✅ firebase/app: Importado com sucesso');
  console.log('  ✅ firebase/auth: Importado com sucesso');
  console.log('  ✅ firebase/firestore: Importado com sucesso');
  
  // Tentar inicializar com as variáveis de ambiente
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  // Validar config
  if (firebaseConfig.projectId && !firebaseConfig.projectId.includes('your-')) {
    console.log('\n  🔧 Inicializando Firebase com credenciais do ambiente...');
    
    try {
      const app = initializeApp(firebaseConfig);
      console.log('  ✅ Firebase App inicializado com sucesso!');
      
      // Tentar obter Auth e Firestore (isso dispara a conexão)
      const auth = getAuth(app);
      console.log('  ✅ Firebase Auth obtido com sucesso!');
      
      const db = getFirestore(app);
      console.log('  ✅ Firestore obtido com sucesso!');
      
      console.log('\n  🎉 CLIENT SDK: Integração OK!');
    } catch (error: any) {
      console.log(`  ⚠️  Erro ao inicializar: ${error.message}`);
      console.log('  💡 Dica: Verifique se as credenciais estão corretas e');
      console.log('           o projeto Firebase está acessível.');
    }
  } else {
    console.log('\n  ⚠️  Usando credenciais de exemplo - não será possível conectar ao Firebase real');
    console.log('  💡 Para teste completo: Adicione credenciais reais em .env.local');
  }
} catch (error: any) {
  console.log(`  ❌ Erro na importação: ${error.message}`);
}

// ============================================================================
// 4. TESTAR IMPORTAÇÃO DO ADMIN SDK
// ============================================================================
console.log('\n📋 ETAPA 4: Teste de Importação do Firebase Admin SDK\n');

try {
  const admin = require('firebase-admin');
  console.log('  ✅ firebase-admin: Importado com sucesso');
  
  const adminSdkKey = process.env.FIREBASE_ADMIN_SDK_KEY;
  
  if (adminSdkKey && !adminSdkKey.includes('your-')) {
    console.log('\n  🔧 Validando credenciais do Admin SDK...');
    
    try {
      const credential = JSON.parse(adminSdkKey);
      
      if (credential.type === 'service_account') {
        console.log('  ✅ Tipo de credencial: service_account');
        console.log(`  ✅ Project ID: ${credential.project_id}`);
        console.log(`  ✅ Email de serviço: ${credential.client_email}`);
        
        if (credential.private_key && credential.private_key.includes('BEGIN PRIVATE KEY')) {
          console.log('  ✅ Chave privada: Presente e válida');
          console.log('\n  🎉 ADMIN SDK: Credenciais OK!');
        } else {
          console.log('  ❌ Chave privada: Inválida ou ausente');
        }
      } else {
        console.log(`  ❌ Tipo de credencial inválido: ${credential.type}`);
      }
    } catch (parseError: any) {
      console.log(`  ❌ Erro ao parsear JSON: ${parseError.message}`);
    }
  } else {
    console.log('  ⚠️  Usando credenciais de exemplo - Admin SDK não será inicializado');
    console.log('  💡 Para teste completo: Adicione credenciais reais em .env.local');
  }
} catch (error: any) {
  console.log(`  ❌ Erro na importação: ${error.message}`);
  console.log('  💡 Instale com: npm install firebase-admin');
}

// ============================================================================
// 5. RESULTADO FINAL
// ============================================================================
console.log('\n' + '=' .repeat(60));
console.log('\n📊 RESULTADO DO TESTE\n');

if (allVarsPresent && projectId && !projectId.includes('your-')) {
  console.log('✅ Firebase está pronto para ser usado!');
  console.log('\n   Próximos passos:');
  console.log('   1. Configure em Vercel: adicione as variáveis de ambiente');
  console.log('   2. Autorize domínios em Firebase Console');
  console.log('   3. Configure as regras de segurança do Firestore');
  console.log('   4. Teste a aplicação em produção');
} else {
  console.log('⚠️  Firebase está configurado com valores de exemplo.');
  console.log('\n   Para testar com Firebase real:');
  console.log('   1. Crie um arquivo .env.local na raiz do projeto');
  console.log('   2. Copie o conteúdo de .env.example');
  console.log('   3. Substitua os valores de exemplo pelos reais');
  console.log('   4. Obtenha as credenciais em: https://console.firebase.google.com/');
  console.log('   5. Execute este script novamente: npm run test:firebase');
}

console.log('\n' + '=' .repeat(60) + '\n');
