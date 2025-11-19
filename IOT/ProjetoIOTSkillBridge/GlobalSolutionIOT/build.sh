#!/bin/bash
set -e

# Configurar variáveis de ambiente do Cargo para usar diretórios temporários
export CARGO_HOME=/tmp/cargo
export CARGO_TARGET_DIR=/tmp/cargo-target
export RUSTUP_HOME=/tmp/rustup

# Criar diretórios se não existirem
mkdir -p $CARGO_HOME
mkdir -p $CARGO_TARGET_DIR
mkdir -p $RUSTUP_HOME

# Atualizar pip e instalar dependências
pip install --upgrade pip setuptools wheel

# Tentar instalar apenas com wheels primeiro, se falhar, instalar normalmente
pip install --prefer-binary -r requirements.txt

