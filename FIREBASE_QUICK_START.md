# 🚀 Firebase Setup - Quick Start

## 📋 Resumo Rápido (5 Passos)

### Passo 1️⃣: Firebase Console
```
1. https://console.firebase.google.com
2. Create Project → zeta-2
3. Add Web App → zeta-2-web
4. COPIE as credenciais mostradas
```

**O que você vai copiar:**
```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

---

### Passo 2️⃣: Baixar Service Account JSON
```
1. Firebase Console → ⚙️ Project Settings
2. Service Accounts → Generate New Private Key
3. Arquivo .json é baixado
4. COPIE TODO O CONTEÚDO (do { ao })
```

---

### Passo 3️⃣: Ativar Firebase Services

#### Autenticação:
```
Firebase Console → Authentication
→ Get Started
→ Email/Password
→ Enable
→ Save
```

#### Firestore Database:
```
Firebase Console → Firestore Database
→ Create Database
→ Location: South America (São Paulo)
→ Mode: Production
→ Create
→ Rules → Publish (usar regras de security)
```

---

### Passo 4️⃣: Adicionar Variáveis no Vercel

Acesse: https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables

Adicione as 7 variáveis (clique "Add New" para cada):

| # | Nome | Valor | Env |
|---|------|-------|-----|
| 1 | `NEXT_PUBLIC_FIREBASE_API_KEY` | Seu API Key | Prod+Preview+Dev |
| 2 | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Seu Auth Domain | Prod+Preview+Dev |
| 3 | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Seu Project ID | Prod+Preview+Dev |
| 4 | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Seu Storage Bucket | Prod+Preview+Dev |
| 5 | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Seu Sender ID | Prod+Preview+Dev |
| 6 | `NEXT_PUBLIC_FIREBASE_APP_ID` | Seu App ID | Prod+Preview+Dev |
| 7 | `FIREBASE_ADMIN_SDK_KEY` | Service Account JSON | **Production Only** ⚠️ |

**DEPOIS: Clique "Redeploy to Production"**

---

### Passo 5️⃣: Autorizar Domínios

Firebase Console → Authentication → Settings → Authorized domains

Adicione:
```
projeto-nextjs-xi.vercel.app
localhost:3000
```

---

## ✅ Pronto!

Depois desses 5 passos:

1. Acesse: https://projeto-nextjs-xi.vercel.app
2. Abra Console (F12)
3. Deve estar tudo verde ✅
4. Sem erros de Firebase

---

## 📖 Detalhes Completos

Para guia passo-a-passo com screenshots/detalhes, veja:
**[FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)**

---

## 🔗 Links

- **Firebase Console**: https://console.firebase.google.com
- **Vercel Settings**: https://vercel.com/ruanzito548s-projects/zeta-2/settings
- **Seu Site**: https://projeto-nextjs-xi.vercel.app

---

**Tempo estimado: 10-15 minutos** ⏱️
