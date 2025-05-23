# 🔧 Configuração de Ambiente - Frontend

## Variáveis de Ambiente

O projeto frontend usa a variável `NEXT_PUBLIC_API_URL` para se comunicar com a API backend.

### Como configurar:

1. **Crie um arquivo `.env.local` na raiz do projeto:**
   ```bash
   # Na pasta CA-front/
   touch .env.local
   ```

2. **Adicione a variável:**
   ```env
   # Para desenvolvimento local
   NEXT_PUBLIC_API_URL=http://localhost:3333

   # Para produção (exemplo)
   # NEXT_PUBLIC_API_URL=https://sua-api.com
   ```

3. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📋 Onde é usada

A variável `NEXT_PUBLIC_API_URL` é utilizada em:

- ✅ `src/services/api.ts` - Serviços de API
- ✅ `src/app/dashboard/loja/page.tsx` - Página da loja
- ✅ `next.config.ts` - Configuração de rewrites **e imagens**

## 🖼️ Configuração de Imagens

As imagens agora são configuradas dinamicamente:

- **Com variável definida**: Usa a URL da `NEXT_PUBLIC_API_URL`
- **Sem variável**: Fallback para `http://localhost:3333`

### Exemplos:

```env
# Desenvolvimento
NEXT_PUBLIC_API_URL=http://localhost:3333
# → Imagens: http://localhost:3333/uploads/**

# Produção
NEXT_PUBLIC_API_URL=https://api.meusite.com
# → Imagens: https://api.meusite.com/uploads/**
```

## 🔄 Fallback

Se a variável não estiver definida, o sistema usa `http://localhost:3333` como padrão.

## ⚠️ Importante

- A variável deve começar com `NEXT_PUBLIC_` para estar disponível no cliente
- Reinicie o servidor após criar/modificar o arquivo `.env.local`
- O arquivo `.env.local` deve estar no `.gitignore` (não commitar)
- A configuração de imagens é aplicada automaticamente baseada na URL 