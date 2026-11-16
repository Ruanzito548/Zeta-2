# 🎯 Configurar Vercel - AGORA (Passo-a-Passo Visual)

## ✅ Status Atual

```
✅ Firebase Projeto Criado: zeta-2
✅ Web App Registrada
✅ Credenciais Públicas: OBTIDAS (6 valores)
⏳ Service Account JSON: FALTA (passo para depois)
⏳ Variáveis Vercel: NÃO ADICIONADAS (próximo passo!)
⏳ Domínios Autorizados: NÃO CONFIGURADO
```

---

## 🔧 O que Fazer Agora

### PASSO 1: Abrir Vercel Settings

1. Acesse: **https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables**

2. Você deve ver esta tela:

```
┌─────────────────────────────────────────────┐
│ Zeta-2 Project Settings                     │
│                                             │
│ [Deploy] [Git] [Domains] [Environment      │
│          [Env Variables] ← CLIQUE AQUI      │
│                                             │
│ Environment Variables                      │
│                                             │
│ [+ Add New]                                 │
└─────────────────────────────────────────────┘
```

---

### PASSO 2: Adicionar 6 Variáveis

Clique em **"[+ Add New]"** e preencha cada uma:

#### **1️⃣ Variável 1 - API Key**

```
┌─────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_FIREBASE_API_KEY          │
│ Value: AIzaSyBhQKuXx9Ev0yueZ7w3JEbD80yE1gwIPoo │
│                                             │
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

**COPIE E COLE ESTA LINHA:**
```
AIzaSyBhQKuXx9Ev0yueZ7w3JEbD80yE1gwIPoo
```

---

#### **2️⃣ Variável 2 - Auth Domain**

```
┌─────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN      │
│ Value: zeta-2.firebaseapp.com               │
│                                             │
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

**COPIE E COLE ESTA LINHA:**
```
zeta-2.firebaseapp.com
```

---

#### **3️⃣ Variável 3 - Project ID**

```
┌─────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID       │
│ Value: zeta-2                               │
│                                             │
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

**COPIE E COLE ESTA LINHA:**
```
zeta-2
```

---

#### **4️⃣ Variável 4 - Storage Bucket**

```
┌─────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET   │
│ Value: zeta-2.firebasestorage.app           │
│                                             │
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

**COPIE E COLE ESTA LINHA:**
```
zeta-2.firebasestorage.app
```

---

#### **5️⃣ Variável 5 - Messaging Sender ID**

```
┌─────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID │
│ Value: 286668624287                         │
│                                             │
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

**COPIE E COLE ESTA LINHA:**
```
286668624287
```

---

#### **6️⃣ Variável 6 - App ID**

```
┌─────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_FIREBASE_APP_ID           │
│ Value: 1:286668624287:web:76833495efe44777dfedaa │
│                                             │
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

**COPIE E COLE ESTA LINHA:**
```
1:286668624287:web:76833495efe44777dfedaa
```

---

### PASSO 3: Vercel vai pedir para Redeploy

Depois de adicionar as 6 variáveis, Vercel vai mostrar:

```
┌─────────────────────────────────────────────┐
│ ⚠️ Project changed                          │
│                                             │
│ You need to redeploy your project for      │
│ environment variables to take effect.      │
│                                             │
│ [Redeploy to Production]  [Later]           │
└─────────────────────────────────────────────┘
```

**CLIQUE EM: [Redeploy to Production]**

```
Aguarde ~2-3 minutos enquanto Vercel:
- Recompila seu projeto
- Injeta as variáveis
- Faz deploy automático
```

---

### PASSO 4: Autorizar Domínios no Firebase

Enquanto Vercel está fazendo redeploy, faça isso:

1. Acesse: **https://console.firebase.google.com**

2. Clique em **"zeta-2"** (seu projeto)

3. No menu esquerdo, procure **"Authentication"** e clique

4. Clique em **"Settings"** (engrenagem no canto superior)

5. Procure **"Authorized domains"**

6. Clique em **"Add domain"** (ou **"+ Add domain"**)

```
┌─────────────────────────────────────────────┐
│ Authorized domains                          │
│                                             │
│ [+ Add domain]                              │
│                                             │
│ Current domains:                            │
│ • localhost                                 │
│                                             │
│ Add new domain:                             │
│ ┌──────────────────────────────────────┐   │
│ │ projeto-nextjs-xi.vercel.app         │   │
│ └──────────────────────────────────────┘   │
│                                             │
│ [Add]                                       │
└─────────────────────────────────────────────┘
```

7. Cole: `projeto-nextjs-xi.vercel.app`

8. Clique em **[Add]**

9. Repita para: `localhost:3000`

---

### PASSO 5: Testar

Espere o Vercel terminar o redeploy, depois:

1. Acesse: **https://projeto-nextjs-xi.vercel.app**

2. Página deve carregar normalmente ✅

3. Abra DevTools (**F12**)

4. Vá para **Console**

5. Procure por mensagens do Firebase

6. **Não deve haver erros vermelhos** ❌

```
Exemplo de saída esperada:
├─ ✅ Firebase initialized successfully
├─ ✅ Connected to Firestore
├─ ✅ Authentication ready
└─ ✅ App ready
```

---

## 📋 Checklist Rápido

```
Verificar no Vercel:
☐ NEXT_PUBLIC_FIREBASE_API_KEY adicionada
☐ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN adicionada
☐ NEXT_PUBLIC_FIREBASE_PROJECT_ID adicionada
☐ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET adicionada
☐ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID adicionada
☐ NEXT_PUBLIC_FIREBASE_APP_ID adicionada
☐ Redeploy feito com sucesso

Verificar no Firebase:
☐ Authentication ativada (Email/Password)
☐ Firestore Database criada
☐ projeto-nextjs-xi.vercel.app autorizado
☐ localhost:3000 autorizado

Verificar no Site:
☐ Página carrega em: https://projeto-nextjs-xi.vercel.app
☐ Console (F12) sem erros vermelhos
☐ Dashboard aparece normalmente
```

---

## 🆘 Se der erro

### Erro: "Firebase configuration is missing"
→ Verificar se TODAS 6 variáveis foram adicionadas
→ Verificar se redeploy terminou
→ Recarregar página (F5) ou Ctrl+Shift+R

### Erro: "unauthorized domain"
→ Firebase → Authentication → Settings
→ Adicionar: projeto-nextjs-xi.vercel.app
→ Esperar 1-2 minutos para surtir efeito

### Variáveis não aparecem
→ Vercel → Settings → Environment Variables
→ Verificar se realmente aparecem na lista
→ Se sim, Redeploy novamente
→ Aguardar 2-3 minutos

---

## ⏭️ Próximo Passo

Depois que tudo estiver funcionando:

1. Baixar **Service Account JSON** do Firebase
2. Adicionar **FIREBASE_ADMIN_SDK_KEY** no Vercel (Production only)
3. Fazer outro Redeploy
4. Pronto! Zeta-2 100% funcional 🚀

---

**Tempo total desta fase: 10-15 minutos** ⏱️

**Você consegue! É só colar nos 6 campos. Depois Redeploy e pronto!** 💪
