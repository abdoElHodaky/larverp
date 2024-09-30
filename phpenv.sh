#!/usr/bin/bash

echo 'export PHPENV_ROOT=/home/abdo_arh36/.phpenv' >> /home/abdo_arh36/.bashrc;

if [ -d "${PHPENV_ROOT}" ]; then 
export PATH="${PHPENV_ROOT}/bin:${PATH}"
eval "$(phpenv init -)"
fi
