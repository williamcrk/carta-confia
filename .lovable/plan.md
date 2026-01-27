

# Plataforma de Marketplace de Cartas de Consórcio Contempladas

## Visão Geral

Uma plataforma web completa e profissional para conectar compradores e vendedores de cartas de consórcio contempladas (imóveis e veículos), com foco em segurança, transparência e confiança. O sistema organiza, valida e acompanha negociações, enquanto todo processo financeiro ocorre via empresa parceira externa.

---

## Design & Identidade Visual

**Estilo:** Minimalista Claro — interface premium estilo fintech
- Fundo predominantemente branco com tons de cinza suave
- Cor primária: Azul confiança para CTAs e elementos de destaque
- Tipografia profissional e espaçamento generoso
- Cards com sombras sutis e bordas arredondadas
- Ícones limpos e badges de verificação que transmitem segurança

---

## Arquitetura de Usuários

### Três tipos de usuário:
1. **Comprador** — busca e negocia cartas contempladas
2. **Vendedor** — anuncia suas cartas para venda
3. **Parceira** — valida documentos, aprova anúncios, acompanha negociações
4. **Admin** — gerencia toda a plataforma

---

## Funcionalidades por Módulo

### 1. Autenticação & Perfis
- Cadastro com seleção de tipo (comprador/vendedor)
- Login seguro com email/senha
- Autenticação em duas etapas (2FA) via código por email
- Perfil completo com:
  - Dados pessoais (nome, CPF/CNPJ)
  - Status de verificação com badges visuais
  - Histórico de negociações realizadas
  - Selo "Validado pela Parceira" para usuários aprovados

### 2. Sistema KYC (Verificação de Identidade)
- Upload de documentos (RG, CNH, Contrato da cota)
- Upload de selfie para validação
- Status visual: Pendente → Em análise → Verificado/Reprovado
- Workflow de aprovação pela empresa parceira

### 3. Marketplace de Cartas Contempladas
- Formulário de publicação com campos:
  - Tipo de consórcio (Imóvel ou Veículo)
  - Valor do crédito
  - Administradora (campo livre)
  - Percentual já pago
  - Valor de entrada solicitado
  - Observações e detalhes
- Status de anúncio: Rascunho → Aguardando aprovação → Publicado
- Listagem pública com:
  - Filtros avançados (tipo, valor, administradora, % pago)
  - Ordenação (preço, data, relevância)
  - Cards visuais com indicadores de confiança
- Página individual do anúncio com todas as informações e selo de verificação

### 4. Fluxo de Negociação
- Botão "Iniciar Negociação" (disponível apenas para verificados)
- Chat interno em tempo real entre:
  - Comprador
  - Vendedor
  - Representante da parceira
- Timeline visual de status:
  - Proposta enviada
  - Proposta em análise
  - Aprovada pela parceira
  - Em andamento
  - Concluída / Cancelada
- Registro completo de todas as ações em log imutável

### 5. Painel da Empresa Parceira
- Dashboard com métricas de validação
- Lista de usuários pendentes de KYC
- Visualização de documentos enviados
- Botões para aprovar/reprovar com campo de observação
- Lista de anúncios aguardando aprovação
- Acompanhamento de todas as negociações ativas
- Campo de notas internas para cada caso

### 6. Painel Administrativo
- Dashboard com estatísticas gerais:
  - Total de usuários, anúncios, negociações
  - Conversões e status
- Gerenciamento de usuários (busca, edição, suspensão)
- Gerenciamento de anúncios (moderação, remoção)
- Visualização de logs de auditoria
- Controle de permissões e papéis

### 7. Segurança & Compliance
- Autenticação em duas etapas (2FA)
- Criptografia de dados sensíveis no banco
- Logs de auditoria imutáveis para todas as ações críticas
- Controle de acesso por papéis (RBAC)
- Proteção contra comportamento suspeito
- Disclaimer claro: "A plataforma não intermedia pagamentos"

---

## Páginas Principais

| Página | Descrição |
|--------|-----------|
| Landing Page | Apresentação da plataforma com proposta de valor e CTAs |
| Cadastro/Login | Fluxo de autenticação com 2FA |
| Marketplace | Listagem de cartas com filtros e busca |
| Detalhes do Anúncio | Página pública com informações e botão de negociação |
| Meu Perfil | Dados pessoais, verificação, histórico |
| Minhas Cartas (Vendedor) | Lista de anúncios próprios |
| Minhas Negociações | Chat e timeline de negociações |
| Publicar Carta | Formulário de novo anúncio |
| Painel Parceira | Dashboard de validação e acompanhamento |
| Painel Admin | Gestão completa da plataforma |

---

## Estrutura de Banco de Dados (Supabase)

### Tabelas principais:
- **profiles** — dados de usuários
- **user_roles** — papéis (buyer, seller, partner, admin)
- **kyc_documents** — documentos enviados para verificação
- **listings** — anúncios de cartas
- **negotiations** — negociações iniciadas
- **messages** — chat das negociações
- **audit_logs** — registro imutável de ações
- **partner_notes** — observações internas da parceira

### Políticas de segurança:
- Row Level Security (RLS) em todas as tabelas
- Funções específicas por papel
- Dados sensíveis protegidos

---

## Diferenciais de Confiança

- Badge "Usuário Verificado" visível nos perfis e anúncios
- Selo "Aprovado pela Parceira" nos anúncios validados
- Indicadores de segurança em toda interface
- Aviso claro sobre não intermediação financeira
- Histórico transparente de negociações

---

## Tecnologias

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Autenticação:** Supabase Auth com 2FA
- **Armazenamento:** Supabase Storage para documentos KYC
- **Real-time:** Supabase Realtime para chat

---

## Resultado Final

Uma plataforma profissional, segura e pronta para produção que:
- Conecta compradores e vendedores de forma organizada
- Transmite confiança através de validações e selos
- Oferece transparência total no fluxo de negociação
- Deixa claro que não intermedia pagamentos
- Escala facilmente para crescimento futuro

