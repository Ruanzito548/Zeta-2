# Firebase Setup - Fluxo Visual

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                  FIREBASE SETUP - ZETA-2                   │
└─────────────────────────────────────────────────────────────┘

PASSO 1: CRIAR PROJETO
┌──────────────────────────────────────┐
│ Firebase Console                     │
│ → "Add project"                      │
│ → Nome: zeta-2                       │
│ → Create Project                     │
└──────────────────────────────────────┘
              ↓

PASSO 2: REGISTRAR WEB APP
┌──────────────────────────────────────┐
│ Firebase Console                     │
│ → </> (Web App)                      │
│ → Nome: zeta-2-web                   │
│ → Register App                       │
│ ✨ COPIAR 6 CREDENCIAIS              │
│   • apiKey                           │
│   • authDomain                       │
│   • projectId                        │
│   • storageBucket                    │
│   • messagingSenderId                │
│   • appId                            │
└──────────────────────────────────────┘
              ↓

PASSO 3: BAIXAR SERVICE ACCOUNT
┌──────────────────────────────────────┐
│ Firebase Console                     │
│ → ⚙️ Project Settings                │
│ → Service Accounts                   │
│ → Generate New Private Key           │
│ → Download JSON                      │
│ ✨ COPIAR CONTEÚDO COMPLETO JSON     │
└──────────────────────────────────────┘
              ↓

PASSO 4: ATIVAR AUTHENTICATION
┌──────────────────────────────────────┐
│ Firebase Console                     │
│ → Authentication                     │
│ → Get Started                        │
│ → Email/Password                     │
│ → Enable & Save                      │
└──────────────────────────────────────┘
              ↓

PASSO 5: CRIAR FIRESTORE
┌──────────────────────────────────────┐
│ Firebase Console                     │
│ → Firestore Database                 │
│ → Create Database                    │
│ → Location: São Paulo                │
│ → Mode: Production                   │
│ → Update Rules                       │
│ → Publish Rules                      │
└──────────────────────────────────────┘
              ↓

PASSO 6: ADICIONAR VARIÁVEIS VERCEL
┌──────────────────────────────────────┐
│ Vercel Settings                      │
│ → Environment Variables              │
│                                      │
│ Adicionar 7 variáveis:               │
│ 1. NEXT_PUBLIC_FIREBASE_API_KEY      │
│ 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  │
│ 3. NEXT_PUBLIC_FIREBASE_PROJECT_ID   │
│ 4. NEXT_PUBLIC_FIREBASE_STORAGE_...  │
│ 5. NEXT_PUBLIC_FIREBASE_MESSAGING... │
│ 6. NEXT_PUBLIC_FIREBASE_APP_ID       │
│ 7. FIREBASE_ADMIN_SDK_KEY ⚠️         │
│    (Production Only!)                │
│                                      │
│ → Redeploy to Production             │
└──────────────────────────────────────┘
              ↓

PASSO 7: AUTORIZAR DOMÍNIOS
┌──────────────────────────────────────┐
│ Firebase Console                     │
│ → Authentication → Settings          │
│ → Authorized domains                 │
│                                      │
│ Adicionar:                           │
│ • projeto-nextjs-xi.vercel.app       │
│ • localhost:3000                     │
│                                      │
│ → Update/Save                        │
└──────────────────────────────────────┘
              ↓

✅ FIREBASE 100% CONFIGURADO
       ↓
   SITE PRONTO!
   https://projeto-nextjs-xi.vercel.app
```

---

## 📊 Mapa de Dados

```
┌─────────────────────────────────────────────────┐
│          FLUXO DE DADOS - ZETA-2               │
└─────────────────────────────────────────────────┘

USUÁRIO
  ↓
  ├→ NAVEGADOR (seu site)
  │  └→ Carrega: projeto-nextjs-xi.vercel.app
  │     ├→ Vercel CDN (hospedagem)
  │     ├→ Vercel Env Vars (credenciais)
  │     └→ Next.js Runtime (código)
  │
  └→ FIREBASE SERVICES
     ├→ Authentication (login/registro)
     ├→ Firestore Database (dados)
     ├→ Cloud Storage (arquivos)
     └→ Cloud Functions (backend)

FLUXO DE AUTENTICAÇÃO:
1. Usuário faz login no site
2. Browser (cliente) envia credenciais
3. Firebase Authentication valida
4. Token JWT retorna ao browser
5. Token usado para acessar Firestore

FLUXO DE DADOS (Firestore):
1. Browser requisita itens
2. Firebase Firestore lê collection "items"
3. Dados retornam filtrados por regras de segurança
4. Browser renderiza dados
```

---

## 🔐 Segurança - Variáveis Públicas vs Privadas

```
┌─────────────────────────────────────────────────┐
│          VARIÁVEIS PÚBLICAS (NEXT_PUBLIC_*)   │
│          Visíveis no navegador                 │
└─────────────────────────────────────────────────┘

✅ SEGURO (Firebase gerencia):
  • NEXT_PUBLIC_FIREBASE_API_KEY
  • NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  • NEXT_PUBLIC_FIREBASE_PROJECT_ID
  • Etc...

Razão: Firebase aplica regras de segurança
       que controlam quem pode ler/escrever


┌─────────────────────────────────────────────────┐
│          VARIÁVEIS PRIVADAS                    │
│          Apenas no servidor Vercel              │
└─────────────────────────────────────────────────┘

🔒 PROTEGIDO (Nunca no navegador):
  • FIREBASE_ADMIN_SDK_KEY
  • Chave privada do projeto Firebase

Razão: Admin SDK tem poderes totais,
       nunca deve sair do servidor


⚠️ SEMPRE:
  • Admin SDK = Production only
  • Nunca commitar secrets em git
  • Nunca expor em logs/console
```

---

## 🎯 Checklist Rápido (Print & Cola)

```
PASSO 1: FIREBASE CONSOLE
☐ https://console.firebase.google.com
☐ Add Project → zeta-2
☐ Aguardar criação

PASSO 2: WEB APP
☐ </> Web App
☐ Nome: zeta-2-web
☐ COPIAR 6 valores

PASSO 3: SERVICE ACCOUNT
☐ ⚙️ Project Settings
☐ Service Accounts
☐ Generate Key & Download
☐ COPIAR conteúdo JSON

PASSO 4: AUTH
☐ Authentication → Get Started
☐ Email/Password → Enable
☐ Save

PASSO 5: FIRESTORE
☐ Firestore Database → Create
☐ São Paulo + Production
☐ Rules → Publish

PASSO 6: VERCEL ENV
☐ https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables
☐ Adicionar 7 variáveis
☐ Redeploy to Production

PASSO 7: DOMÍNIOS
☐ Firebase Auth → Settings
☐ Add: projeto-nextjs-xi.vercel.app
☐ Add: localhost:3000
☐ Save

TESTE:
☐ https://projeto-nextjs-xi.vercel.app (carrega?)
☐ F12 → Console (erros?)
☐ ✅ Pronto!
```

---

## ⏱️ Tempo Estimado

| Passo | Ação | Tempo |
|-------|------|-------|
| 1 | Criar projeto Firebase | 2-3 min |
| 2 | Registrar Web App | 1 min |
| 3 | Baixar Service Account | 1 min |
| 4 | Ativar Authentication | 1 min |
| 5 | Criar Firestore + Rules | 2-3 min |
| 6 | Adicionar variáveis + Redeploy | 5-7 min |
| 7 | Autorizar domínios | 1-2 min |
| **TOTAL** | | **15-20 min** |

---

## 🚨 Troubleshooting Rápido

```
❌ "Firebase configuration is missing"
→ Vercel: Adicione TODAS 7 variáveis
→ Vercel: Redeploy to Production
→ Aguarde 2-3 min

❌ "unauthorized domain"
→ Firebase: Auth → Settings → Authorized domains
→ Adicione seu domínio Vercel

❌ "CORS error"
→ Mesmo problema acima
→ Autorizar domínio resolve

❌ Página branca/vazia
→ F12 → Console
→ Veja erros específicos
→ Procure por "Firebase"

❌ Variáveis não aparecem
→ Verificar se realmente foram salvas no Vercel
→ Redeploy novamente
→ Recarregar página (F5) ou Ctrl+Shift+R
```

---

## 📚 Referência Rápida

| Item | Link |
|------|------|
| Firebase Console | https://console.firebase.google.com |
| Vercel Project | https://vercel.com/ruanzito548s-projects/zeta-2 |
| Vercel Env Settings | https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables |
| Seu Site | https://projeto-nextjs-xi.vercel.app |
| Guia Completo | FIREBASE_SETUP_GUIDE.md |
| Quick Start | FIREBASE_QUICK_START.md |
| Checklist | FIREBASE_CHECKLIST.md |

---

## ✨ Pronto!

Siga este fluxo e Firebase estará **100% funcionando** em ~15 minutos! 🚀
