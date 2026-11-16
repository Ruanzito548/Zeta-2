# 🔑 Firebase Credenciais - Prontas para Vercel

**Data:** 2026-11-16
**Status:** ✅ Credenciais obtidas do Firebase Console

---

## 📋 Suas Credenciais (Pública)

```javascript
{
  apiKey: "AIzaSyBhQKuXx9Ev0yueZ7w3JEbD80yE1gwIPoo",
  authDomain: "zeta-2.firebaseapp.com",
  projectId: "zeta-2",
  storageBucket: "zeta-2.firebasestorage.app",
  messagingSenderId: "286668624287",
  appId: "1:286668624287:web:76833495efe44777dfedaa",
  measurementId: "G-ZLJYNN2XDX"
}
```

---

## 🎯 Próximos Passos

### ✅ Passo 1: Você já fez (Credenciais Públicas)
```
✅ Firebase Console → Web App Registrada
✅ Copiou as 6 credenciais públicas
✅ Estão prontas abaixo
```

---

### ⏳ Passo 2: Baixar Service Account JSON (FALTA)

**No Firebase Console:**
1. Clique em **⚙️ Project Settings** (engrenagem no canto superior direito)
2. Vá para a aba **"Service Accounts"**
3. Clique em **"Generate New Private Key"**
4. Um arquivo `.json` será baixado (ex: `zeta-2-firebase-adminsdk-xxx.json`)
5. **COPIE TODO O CONTEÚDO** do arquivo aberto em um editor de texto

**Ou me envie o conteúdo completo do JSON para eu adicionar também.**

---

### ⏳ Passo 3: Adicionar Variáveis no Vercel

Acesse: https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables

Clique em **"Add New"** para cada variável abaixo:

#### **Variável 1:**
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyBhQKuXx9Ev0yueZ7w3JEbD80yE1gwIPoo
Environments: Marque todas (Production, Preview, Development)
```

#### **Variável 2:**
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: zeta-2.firebaseapp.com
Environments: Marque todas
```

#### **Variável 3:**
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: zeta-2
Environments: Marque todas
```

#### **Variável 4:**
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: zeta-2.firebasestorage.app
Environments: Marque todas
```

#### **Variável 5:**
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 286668624287
Environments: Marque todas
```

#### **Variável 6:**
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:286668624287:web:76833495efe44777dfedaa
Environments: Marque todas
```

#### **Variável 7:** (Service Account - você ainda precisa obter)
```
Name: FIREBASE_ADMIN_SDK_KEY
Value: [conteúdo completo do JSON]
Environments: APENAS Production (desmarque Preview e Development!)
```

---

### ✅ Passo 4: Redeploy no Vercel

Depois de adicionar as 6 variáveis (ou todas 7 se já tiver o JSON):
1. Vercel vai pedir para **"Redeploy"**
2. Clique em **"Redeploy to Production"**
3. Aguarde ~2-3 minutos

---

### ✅ Passo 5: Autorizar Domínios no Firebase

**No Firebase Console:**
1. Vá para **Authentication** (lado esquerdo)
2. Clique em **"Settings"** (engrenagem)
3. Procure **"Authorized domains"**
4. Clique em **"Add domain"** (ou **"+Add domain"**)

Adicione estes 2 domínios:
```
projeto-nextjs-xi.vercel.app
localhost:3000
```

5. Clique em **"Save"** ou **"Update"**

---

## 📊 Checklist Final

- [ ] Service Account JSON baixado
- [ ] Variável 1 (API_KEY) adicionada no Vercel
- [ ] Variável 2 (AUTH_DOMAIN) adicionada no Vercel
- [ ] Variável 3 (PROJECT_ID) adicionada no Vercel
- [ ] Variável 4 (STORAGE_BUCKET) adicionada no Vercel
- [ ] Variável 5 (MESSAGING_SENDER_ID) adicionada no Vercel
- [ ] Variável 6 (APP_ID) adicionada no Vercel
- [ ] Variável 7 (ADMIN_SDK_KEY) adicionada no Vercel
- [ ] Redeploy feito no Vercel
- [ ] Domínios autorizados no Firebase
- [ ] Site testado em: https://projeto-nextjs-xi.vercel.app

---

## 🧪 Testar

Depois de tudo pronto:

```bash
# 1. Acesse seu site
https://projeto-nextjs-xi.vercel.app

# 2. Abra DevTools (F12)
# 3. Vá para Console
# 4. Procure por "Firebase" - deve ter mensagens de sucesso ✅
# 5. Nenhum erro em vermelho
```

---

## ✨ Próximo Passo

Envie o conteúdo do **Service Account JSON** (ou diga quando tiver baixado) e eu:
1. Vou adicionar a variável 7 também
2. Vou criar um guia final de teste

---

**Suas credenciais públicas estão seguras aqui. O JSON privado você mantém só com você até adicionar no Vercel!** 🔒
