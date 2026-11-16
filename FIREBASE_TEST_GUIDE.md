# 🔥 Guia de Teste do Firebase - Zeta 2

## Status Atual ✅

O teste de integração do Firebase foi **executado com sucesso**! 

```
✅ Importação do Client SDK: OK
✅ Importação do Admin SDK: OK  
✅ Validação de Variáveis: OK
✅ Validação de Formato: OK
```

## 📊 Resultado do Teste

```
Variáveis Obrigatórias (PUBLIC):
  ✅ NEXT_PUBLIC_FIREBASE_API_KEY
  ✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ✅ NEXT_PUBLIC_FIREBASE_APP_ID

Variáveis Opcionais:
  ✅ FIREBASE_ADMIN_SDK_KEY
  ✅ NEXT_PUBLIC_USE_FIREBASE_EMULATOR
```

## 🧪 Teste Completo com Credenciais Reais

Atualmente o teste está usando **valores de exemplo**. Para fazer o teste completo com **Firebase real**, siga estes passos:

### 1️⃣ Obter as Credenciais Reais

**Passo 1:** Acesse https://console.firebase.google.com/

**Passo 2:** Clique no seu projeto **"zeta-2"**

**Passo 3:** Vá em **Project Settings** (engrenagem no canto superior esquerdo)

**Passo 4:** Copie as credenciais do seu app Web:
```
API Key
Auth Domain
Project ID
Storage Bucket
Messaging Sender ID
App ID
```

### 2️⃣ Criar Arquivo `.env.local`

**Passo 1:** Na raiz do projeto, crie um arquivo chamado `.env.local`

**Passo 2:** Copie o conteúdo de `.env.example`:
```bash
cp .env.example .env.local
```

**Passo 3:** Abra `.env.local` e substitua os valores de exemplo pelos reais:

```bash
# Cliente Firebase (valores reais do Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza... (sua chave real)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...

# Admin SDK (opcional - apenas se tiver Service Account)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account",...}
```

### 3️⃣ Executar o Teste

```bash
npm run test:firebase
```

**Resultado esperado:**
```
✅ Firebase App inicializado com sucesso!
✅ Firebase Auth obtido com sucesso!
✅ Firestore obtido com sucesso!
🎉 CLIENT SDK: Integração OK!
```

## 🔑 Como Obter Service Account Key (Admin SDK)

Se quiser testar o **Admin SDK** também:

**Passo 1:** Acesse https://console.firebase.google.com/

**Passo 2:** Clique no seu projeto **"zeta-2"**

**Passo 3:** Vá em **Project Settings > Service Accounts**

**Passo 4:** Clique em **"Generate New Private Key"**

**Passo 5:** Um arquivo JSON será baixado

**Passo 6:** Copie TODO o conteúdo JSON e configure em `.env.local`:
```
FIREBASE_ADMIN_SDK_KEY={"type":"service_account",...}
```

⚠️ **IMPORTANTE:** Nunca commit este arquivo! O `.gitignore` já protege `.env.local`.

## 🌐 Teste em Desenvolvimento Local

Depois de configurar `.env.local`:

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:3000 e abra o console do navegador (F12).

Procure por mensagens do Firebase como:
- `✅ Firebase initialized`
- `✅ Firestore connected`

Se ver erros como "auth/unauthorized-domain", configure:
- Vá para Firebase Console > Authentication > Authorized domains
- Adicione: `localhost:3000`

## 📱 Teste em Produção (Vercel)

Depois que adicionar as variáveis em Vercel:

**Passo 1:** Acesse https://vercel.com/ruanzito548s-projects/zeta-2

**Passo 2:** Vá em **Settings > Environment Variables**

**Passo 3:** Adicione as 7 variáveis:
- 6 públicas (NEXT_PUBLIC_*)
- 1 privada (FIREBASE_ADMIN_SDK_KEY) - apenas Production

**Passo 4:** Clique em **Redeploy to Production**

**Passo 5:** Acesse https://projeto-nextjs-xi.vercel.app

**Passo 6:** Abra o console (F12) e procure por mensagens do Firebase

Se ver erro "auth/invalid-api-key":
- Firebase Console > Authentication > Authorized domains
- Adicione: `projeto-nextjs-xi.vercel.app`

## ✅ Checklist de Teste

```
Local (.env.local):
  ☐ Arquivo .env.local criado
  ☐ Credenciais reais adicionadas
  ☐ npm run test:firebase passou
  ☐ npm run dev funciona sem erros Firebase
  ☐ Console do navegador mostra Firebase pronto

Vercel:
  ☐ 6 variáveis públicas adicionadas
  ☐ 1 variável privada adicionada (Production only)
  ☐ Redeploy realizado
  ☐ Site acessível em Vercel
  ☐ Console mostra Firebase conectado
  
Firebase Console:
  ☐ localhost:3000 adicionado em Authorized Domains
  ☐ projeto-nextjs-xi.vercel.app adicionado em Authorized Domains
  ☐ Firestore Security Rules publicadas
```

## 🐛 Troubleshooting

### Erro: "auth/unauthorized-domain"
**Solução:** Adicione o domínio em Firebase Console > Authentication > Authorized domains

### Erro: "Firebase app already initialized"
**Solução:** Já existe uma instância do Firebase. Isso é normal em desenvolvimento.

### Erro: "Invalid API key"
**Solução:** Verifique se a API Key está correta em `.env.local`

### Admin SDK não inicializa
**Solução:** Verifique se o JSON do Service Account está válido e não contém quebras de linha extras

### Script não encontra .env.local
**Solução:** Execute o script da raiz do projeto:
```bash
cd "C:\Users\leand\Desktop\Projeto Zeta 2\projeto-nextjs"
npm run test:firebase
```

## 📚 Referências

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Client SDK Docs](https://firebase.google.com/docs/web/setup)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

## 🎯 Próximos Passos

1. ✅ Teste com credenciais reais (este guia)
2. Configure em Vercel (guia separado)
3. Teste a aplicação em produção
4. Comece Phase 2a: Admin SDK Integration Testing
5. Implemente data import pipeline

---

**Script de teste criado em:** `scripts/test-firebase.ts`  
**Para executar:** `npm run test:firebase`
