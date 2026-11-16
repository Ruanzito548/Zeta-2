# 🔥 Firebase Setup Completo para Zeta-2

## Passo 1: Criar/Acessar Projeto Firebase

### 1.1 Ir ao Firebase Console
1. Acesse: https://console.firebase.google.com
2. Clique em **"Add project"** (ou selecione projeto existente)
3. Nome do projeto: `zeta-2`
4. Clique em **"Create Project"**
5. Aguarde ~1-2 minutos

### 1.2 Ativar Google Analytics (opcional)
- Pode pular ou ativar
- Não afeta o funcionamento

---

## Passo 2: Obter Credenciais Web

### 2.1 Registrar Web App
1. No Firebase Console, clique no ícone **`</>`** (Web)
2. Digite: `zeta-2-web`
3. Marque: "Also set up Firebase Hosting"
4. Clique em **"Register app"**

### 2.2 Copiar Credenciais
Você verá um código assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "projeto-zeta-2.firebaseapp.com",
  projectId: "projeto-zeta-2",
  storageBucket: "projeto-zeta-2.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**COPIE ESSES VALORES** - vamos usar em breve!

---

## Passo 3: Baixar Service Account (Firebase Admin)

### 3.1 Ir para Project Settings
1. No Firebase Console, clique na **engrenagem** (⚙️) → **Project Settings**
2. Vá para a aba **"Service Accounts"**
3. Clique em **"Generate New Private Key"**
4. Um arquivo JSON será baixado (ex: `zeta-2-firebase-adminsdk-xxx.json`)

### 3.2 Abrir o JSON
1. Abra o arquivo com um editor de texto
2. **COPIE TODO O CONTEÚDO** (do `{` ao `}`)
3. Vamos usar em breve

---

## Passo 4: Ativar Autenticação

### 4.1 Ir para Authentication
1. No Firebase Console, clique em **Authentication** (lado esquerdo)
2. Clique em **"Get Started"**
3. Na aba **"Sign-in method"**, clique em **"Email/Password"**
4. Ative a opção **"Email/Password"**
5. Clique em **"Save"**

---

## Passo 5: Criar Firestore Database

### 5.1 Criar Database
1. No Firebase Console, clique em **Firestore Database**
2. Clique em **"Create Database"**

### 5.2 Configuração
- **Location**: Escolha a mais próxima do Brasil (ex: South America - São Paulo)
- **Mode**: Escolha **"Production mode"**
- Clique em **"Create"**

### 5.3 Regras de Segurança (Temporário - para testes)
Vá para **"Rules"** e substitua por:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write
    match /items/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
    
    // User data: only readable/writable by owner
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Clique em **"Publish"**

---

## Passo 6: Adicionar Variáveis no Vercel

### 6.1 Ir para Vercel Settings
1. Acesse: https://vercel.com/ruanzito548s-projects/zeta-2
2. Clique em **"Settings"**
3. Vá para **"Environment Variables"**

### 6.2 Adicionar Variáveis
Clique em **"Add New"** para cada variável:

#### Variável 1: API Key
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSy... (do seu Firebase)
Environments: Production, Preview, Development
```

#### Variável 2: Auth Domain
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: projeto-zeta-2.firebaseapp.com
Environments: Production, Preview, Development
```

#### Variável 3: Project ID
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: projeto-zeta-2
Environments: Production, Preview, Development
```

#### Variável 4: Storage Bucket
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: projeto-zeta-2.appspot.com
Environments: Production, Preview, Development
```

#### Variável 5: Messaging Sender ID
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789
Environments: Production, Preview, Development
```

#### Variável 6: App ID
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:123456789:web:abcdef123456
Environments: Production, Preview, Development
```

#### Variável 7: Admin SDK Key
```
Name: FIREBASE_ADMIN_SDK_KEY
Value: {"type":"service_account","project_id":"projeto-zeta-2",...}
Environments: Production (APENAS Production!)
```

### 6.3 Salvar e Redeploy
1. Depois de adicionar TODAS as 7 variáveis
2. Clique em **"Save"**
3. Vercel vai pedir para **"Redeploy"**
4. Clique em **"Redeploy to Production"**
5. Aguarde ~2-3 minutos

---

## Passo 7: Autorizar Domínios no Firebase

### 7.1 Ir para Authentication Settings
1. No Firebase Console, vá para **Authentication**
2. Clique em **"Settings"** (engrenagem no topo)
3. Procure **"Authorized domains"**

### 7.2 Adicionar Domínios
Clique em **"Add domain"** para cada um:

```
projeto-nextjs-xi.vercel.app
localhost:3000
```

(Adicione também a versão sem alias se quiser:)
```
projeto-nextjs-kd51038hy-ruanzito548s-projects.vercel.app
```

### 7.3 Salvar
Clique em **"Update"** ou **"Save"**

---

## Passo 8: Testar

### 8.1 Acesse seu site
Vá para: https://projeto-nextjs-xi.vercel.app

### 8.2 Verifique o Status
Na página, você deve ver:
- Dashboard carregando ✅
- **Sistema Status** com Firebase conectado ✅

### 8.3 Verifique Console (F12)
Abra o DevTools (F12):
- Vá para **Console**
- Não deve haver erros de Firebase
- Deve haver mensagens de inicialização do Firebase

---

## ✅ Checklist Final

Depois de completar tudo:

- [ ] Projeto Firebase criado
- [ ] Web App registrado
- [ ] Credenciais obtidas (6 valores)
- [ ] Service Account JSON baixado
- [ ] Autenticação ativada
- [ ] Firestore criado
- [ ] 7 variáveis adicionadas no Vercel
- [ ] Deploy atualizado (Redeploy feito)
- [ ] Domínios autorizados no Firebase
- [ ] Site acessível sem erros

---

## 🔗 Links Rápidos

| Ação | Link |
|------|------|
| Firebase Console | https://console.firebase.google.com |
| Vercel Project | https://vercel.com/ruanzito548s-projects/zeta-2 |
| Vercel Env Vars | https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables |
| Site ao Vivo | https://projeto-nextjs-xi.vercel.app |

---

## 🆘 Troubleshooting

### Erro: "Firebase configuration is missing"
- Verifique se **TODAS** as 7 variáveis foram adicionadas
- Confirme se fez **"Redeploy"** no Vercel
- Aguarde 2-3 minutos

### Erro: "unauthorized domain"
- Vá para Firebase → Authentication → Settings
- Adicione seu domínio Vercel em "Authorized domains"

### Erro: "CORS"
- Mesmo problema acima
- Autorizar o domínio resolve

### Variáveis não aparecem no site
- F12 → Console
- Veja se mostra erro de variáveis vazias
- Se sim, Redeploy novamente

---

## 📝 Notas Importantes

1. **NEXT_PUBLIC_* são públicas** - visíveis no navegador (normal, Firebase precisa)
2. **FIREBASE_ADMIN_SDK_KEY é privada** - nunca exponha, adicione APENAS em Production
3. **Firestore Rules** - Use as regras acima para começar, refine depois
4. **Domínios** - Autorizar é essencial para autenticação funcionar

---

**Pronto! Siga este guia passo-a-passo e Firebase estará 100% configurado! 🚀**
