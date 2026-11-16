# Firebase Setup - Checklist Interativo

## 🎯 Objetivo
Configurar Firebase completamente para Zeta-2 em ~15 minutos.

---

## 📝 Checklist

### Fase 1: Criar Projeto Firebase

- [ ] Acesse https://console.firebase.google.com
- [ ] Clique em **"Add project"**
- [ ] Nome: `zeta-2`
- [ ] Clique em **"Create Project"** (aguarde 1-2 min)
- [ ] Projeto criado com sucesso ✅

**Suas credenciais do projeto:**
```
Project ID: ___________________________
Auth Domain: ___________________________
```

---

### Fase 2: Registrar Web App

- [ ] No Firebase Console, clique no ícone **`</>`** (Web)
- [ ] Nome do app: `zeta-2-web`
- [ ] Marque: "Also set up Firebase Hosting"
- [ ] Clique em **"Register app"**

**Você verá um código com 6 valores. COPIE AQUI:**

```javascript
{
  apiKey: "________________________________",
  authDomain: "________________________________",
  projectId: "________________________________",
  storageBucket: "________________________________",
  messagingSenderId: "________________________________",
  appId: "________________________________"
}
```

---

### Fase 3: Baixar Service Account

- [ ] No Firebase Console, clique em **⚙️ Project Settings**
- [ ] Vá para **"Service Accounts"**
- [ ] Clique em **"Generate New Private Key"**
- [ ] Arquivo JSON será baixado
- [ ] Abra o JSON e copie TODO O CONTEÚDO (do `{` ao `}`)

**Cole aqui (apenas para referência local):**
```json
{
  "type": "service_account",
  "project_id": "________________________________",
  ...
}
```

---

### Fase 4: Ativar Autenticação

- [ ] No Firebase Console, clique em **Authentication**
- [ ] Clique em **"Get Started"**
- [ ] Na aba **"Sign-in method"**, procure **"Email/Password"**
- [ ] Clique nele
- [ ] Ative a opção **"Email/Password"**
- [ ] Clique em **"Save"**

**Status:** Autenticação ativada ✅

---

### Fase 5: Criar Firestore Database

- [ ] No Firebase Console, clique em **Firestore Database**
- [ ] Clique em **"Create Database"**
- [ ] Location: **South America (São Paulo)**
- [ ] Mode: **Production**
- [ ] Clique em **"Create"** (aguarde 1-2 min)

**Próximo: Configurar Rules**

- [ ] Vá para a aba **"Rules"**
- [ ] Substitua todo o conteúdo por:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Items: leitura pública, escrita autenticada
    match /items/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
    
    // Usuários: apenas dono pode ler/escrever
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Padrão: negar tudo
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

- [ ] Clique em **"Publish"**

**Status:** Firestore criado ✅

---

### Fase 6: Adicionar Variáveis no Vercel

Acesse: https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables

Para cada linha abaixo, clique em **"Add New"** e preencha:

#### Variável 1
- [ ] Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] Value: `[seu API Key do Passo 2]`
- [ ] Environments: marque todas (Prod + Preview + Dev)
- [ ] Clique em **"Save"**

#### Variável 2
- [ ] Name: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] Value: `[seu Auth Domain do Passo 2]`
- [ ] Environments: marque todas
- [ ] Clique em **"Save"**

#### Variável 3
- [ ] Name: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] Value: `[seu Project ID do Passo 2]`
- [ ] Environments: marque todas
- [ ] Clique em **"Save"**

#### Variável 4
- [ ] Name: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] Value: `[seu Storage Bucket do Passo 2]`
- [ ] Environments: marque todas
- [ ] Clique em **"Save"**

#### Variável 5
- [ ] Name: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Value: `[seu Messaging Sender ID do Passo 2]`
- [ ] Environments: marque todas
- [ ] Clique em **"Save"**

#### Variável 6
- [ ] Name: `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Value: `[seu App ID do Passo 2]`
- [ ] Environments: marque todas
- [ ] Clique em **"Save"**

#### Variável 7 ⚠️ **IMPORTANTE**
- [ ] Name: `FIREBASE_ADMIN_SDK_KEY`
- [ ] Value: `[conteúdo completo do JSON do Passo 3]`
- [ ] Environments: **APENAS Production** (desmarque Preview e Dev!)
- [ ] Clique em **"Save"**

**Depois de todas as 7 variáveis:**
- [ ] Vercel vai pedir para **"Redeploy"**
- [ ] Clique em **"Redeploy to Production"**
- [ ] Aguarde ~2-3 minutos

**Status:** Variáveis adicionadas ✅

---

### Fase 7: Autorizar Domínios

- [ ] No Firebase Console, vá para **Authentication**
- [ ] Clique em **"Settings"** (engrenagem no topo)
- [ ] Procure **"Authorized domains"**
- [ ] Clique em **"Add domain"** (ou **"Add domain"**)

Adicione estes domínios:

- [ ] `projeto-nextjs-xi.vercel.app`
- [ ] `localhost:3000`

(Opcional, se quiser URL auto-gerada também):
- [ ] `projeto-nextjs-kd51038hy-ruanzito548s-projects.vercel.app`

**Depois:**
- [ ] Clique em **"Update"** ou **"Save"**

**Status:** Domínios autorizados ✅

---

## 🧪 Teste Final

### Testar no Navegador
- [ ] Acesse: https://projeto-nextjs-xi.vercel.app
- [ ] Página deve carregar normalmente
- [ ] Dashboard deve aparecer

### Verificar Console (F12)
- [ ] Abra DevTools (F12)
- [ ] Vá para a aba **"Console"**
- [ ] Procure por mensagens de Firebase
- [ ] **Não deve haver erros em vermelho** ❌
- [ ] Se houver erros, procure por mensagens tipo "Firebase initialization"

### Verificar Firestore (opcional)
- [ ] No Firebase Console, vá para **Firestore Database**
- [ ] Clique na aba **"Data"**
- [ ] Deve aparecer vazia ou com coleções criadas

---

## ✅ Conclusão

Se todas as caixas acima estão marcadas ✅, Firebase está **100% configurado**!

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Erro: "Firebase configuration is missing" | Verifique se TODAS 7 variáveis foram adicionadas no Vercel |
| Erro: "unauthorized domain" | Adicione o domínio Vercel em Firebase → Authentication → Authorized domains |
| Erro: "CORS" | Mesmo problema acima |
| Variáveis não aparecem | Aguarde 2-3 min do Redeploy, depois recarregue F5 |
| Vazio/branco na página | Verificar console (F12) para erros específicos |

---

## 📞 Próximas Fases

Depois que Firebase estiver 100% funcionando:

**Phase 2**: Importar dados WoW Forever
- [ ] Investigar WoW Forever API
- [ ] Criar pipeline de importação
- [ ] Popular Firestore com itens

**Phase 3**: Implementar funcionalidades principais
- [ ] Dashboard com gráficos
- [ ] Busca de itens
- [ ] Sugestões de lucro

---

**Tempo total: ~15 minutos**
**Dificuldade: Fácil** ✨
