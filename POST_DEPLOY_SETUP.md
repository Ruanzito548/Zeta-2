# Zeta-2 - Pós Deploy Setup

## 📋 Status Atual

✅ **O que está pronto:**
- Projeto deployado no Vercel: `https://projeto-nextjs-xi.vercel.app`
- Repositório renomeado para `zeta-2`
- Build funcionando perfeitamente
- URL do Vercel: `vercel.com/.../zeta-2`

⚠️ **O que precisa fazer:**
- Adicionar variáveis de ambiente do Firebase
- Autorizar domínio no Firebase Console

---

## 🔧 Passo 1: Adicionar Variáveis de Ambiente no Vercel

### 1.1 Acesse o Dashboard Vercel
Vá para: **https://vercel.com/ruanzito548s-projects/zeta-2**

### 1.2 Vá para Settings
- Clique em **Settings**
- Selecione **Environment Variables** na barra lateral esquerda

### 1.3 Adicione suas credenciais do Firebase

Clique em **"Add New"** e preencha cada uma:

```
Nome: NEXT_PUBLIC_FIREBASE_API_KEY
Valor: [sua chave de API do Firebase]
Ambientes: Production, Preview, Development
```

Repita para todas estas variáveis:

| Nome | Valor | Fonte |
|------|-------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Seu API Key | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Seu Project ID | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `seu-projeto.appspot.com` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Seu Sender ID | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Seu App ID | Firebase Console → Project Settings |
| `FIREBASE_ADMIN_SDK_KEY` | `{"type":"service_account",...}` | Firebase Console → Service Accounts |

### 1.4 Salvar e Redeploy

1. Depois de adicionar todas as variáveis, clique em **"Save"**
2. Vercel vai mostrar um aviso: **"Deployment Protection Enabled"**
3. Clique em **"Redeploy"** para aplicar as variáveis

---

## 🔐 Passo 2: Adicionar Domínio no Firebase Console

### 2.1 Acesse Firebase Console
Vá para: https://console.firebase.google.com

### 2.2 Selecione seu projeto
Escolha o projeto Zeta 2

### 2.3 Autorizar Domínios
- Vá para **Authentication** → **Settings**
- Procure **Authorized domains**
- Clique em **"Add domain"**

Adicione estes domínios:
```
projeto-nextjs-xi.vercel.app
localhost:3000
```

Exemplo:
```
projeto-nextjs-kd51038hy-ruanzito548s-projects.vercel.app
projeto-nextjs-xi.vercel.app
localhost:3000
```

### 2.4 Salvar
Clique em **"Save"** ou **"Update"**

---

## 🧪 Passo 3: Testar o Deployment

### 3.1 Acesse a URL
Vá para: https://projeto-nextjs-xi.vercel.app

### 3.2 Verifique o status
Na página inicial, você deve ver:
- Dashboard carregando
- **Sistema Status** deve mostrar verde ✅ (se Firebase estiver configurado)
- Nenhum erro no console (F12)

### 3.3 Verifique os logs do Vercel
- Acesse: https://vercel.com/ruanzito548s-projects/zeta-2
- Clique em **"Deployments"**
- Veja os logs do último deploy
- Procure por erros de Firebase

---

## 🔗 Links Importantes

| Ação | Link |
|------|------|
| **Seu site** | https://projeto-nextjs-xi.vercel.app |
| **Dashboard Vercel** | https://vercel.com/ruanzito548s-projects/zeta-2 |
| **Environment Vars** | https://vercel.com/ruanzito548s-projects/zeta-2/settings/environment-variables |
| **Firebase Console** | https://console.firebase.google.com |
| **GitHub Repo** | https://github.com/Ruanzito548/Zeta-2 |

---

## ✅ Checklist Final

Depois de completar os passos acima:

- [ ] Variáveis de ambiente adicionadas no Vercel
- [ ] Deploy atualizado com as variáveis
- [ ] Domínios autorizados no Firebase
- [ ] Site acessível sem erros
- [ ] Console do navegador (F12) sem erros
- [ ] Firebase Auth funcionando

---

## 🚨 Troubleshooting

### Problema: "Firebase configuration is missing"
**Solução:** Variáveis de ambiente não foram aplicadas
- Verifique se todas as variáveis foram adicionadas
- Clique em **"Redeploy"** manualmente
- Aguarde 2-3 minutos

### Problema: "unauthorized domain"
**Solução:** Domínio não autorizado no Firebase
- Vá para Firebase Console → Authentication → Settings
- Adicione seu domínio Vercel em Authorized domains

### Problema: "CORS error"
**Solução:** Configure CORS no Firebase
- Ou autorize seu domínio Vercel
- Ou use o Firebase Emulator para testes locais

---

## 📝 Notas Importantes

1. **A renomeação para "zeta-2" não causa problemas** com:
   - Firebase (completamente separado)
   - GitHub (seu repositório é Zeta-2)
   - Build (projeto é agnóstico a nomes)

2. **O aviso sobre OIDC** (OpenID Connect) só afeta se você usa:
   - Autenticação OIDC
   - Integração com serviços externos complexos
   - Você provavelmente pode ignorar

3. **Deploy automático** funciona quando:
   - Você faz push ao GitHub
   - Vercel detecta mudanças
   - Build é feito automaticamente
   - Código é deployado

---

## 🎯 Próximas Fases

Depois que Firebase estiver configurado:

**Phase 2 (Próximo):**
- Investigar fontes de dados WoW Forever
- Construir pipeline de importação
- Testar com dados de amostra

**Phase 3+:**
- Implementar funcionalidades principais
- Adicionar user authentication
- Integrar banco de dados

---

## 💬 Suporte

Se encontrar problemas:
1. Veja logs do Vercel: Dashboard → Deployments
2. Verifique console do navegador: F12 → Console
3. Confirme variáveis: Vercel Settings → Environment Variables
4. Teste localmente: `npm run dev`

---

**Status:** ✅ Pronto para Phase 2 após completar os passos acima!
