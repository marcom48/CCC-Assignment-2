#!/bin/bash

. ./openrc.sh; ansible-playbook --ask-become-pass instance_setup.yaml;
wait
# . ./openrc.sh;
ansible-playbook --vault-password-file vault_password --ask-become-pass -i openstack_inventory.py full_setup.yaml;

