# NS Links – Firebase

## 1. Firebase (console.firebase.google.com)
1. Criar projeto (plano Spark, gratuito).
2. Authentication > Começar > ativar **Google** e **E-mail/senha**.
3. Authentication > Configurações > **Domínios autorizados** > adicionar `link.nsnexus.com.br`.
4. Firestore Database > Criar banco (região southamerica-east1) > modo produção.
5. Firestore > **Regras** > colar o conteúdo de `firestore.rules` > Publicar.
6. Configurações do projeto > Seus apps > Web (</>) > copiar o `firebaseConfig` para `firebase-config.js`.

## 2. Publicar (Cloudflare Pages)
Workers & Pages > Create > Pages > Upload assets > enviar esta pasta.
Custom domains > `link.nsnexus.com.br`.

## 3. Uso
- `link.nsnexus.com.br/`  → login + editor (salva automaticamente)
- `link.nsnexus.com.br/{slug}` → página pública
- Teste local (Live Server): `index.html?u=slug`
