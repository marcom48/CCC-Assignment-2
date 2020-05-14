#!/bin/bash

# Source OpenStack Cloud credentials
if [[ -z "${OS_PROJECT_ID}" ]]; then
  . ./openrc.sh;
fi

echo "Please enter job number: "
echo "1. Create instances"
echo "2. Perform general instance configuration"
echo "3. Start CouchDB cluster"
echo "4. Start Nginx"
echo "5. Start Harvester"
echo "6. Start Processor"
echo "7. Start Website"
echo "8. Full deployment (all jobs)"

read inpt


case $inpt in 
    "1")
        ansible-playbook --ask-become-pass instance_setup.yaml;
        ;;
    "2")
        ansible-playbook -i openstack_inventory.py config_general.yaml;
        ;;
    "3")
        ansible-playbook --ask-vault-pass -i openstack_inventory.py config_couchdb.yaml;
        ;;
    "4")
        ansible-playbook -i openstack_inventory.py config_nginx.yaml
        ;;
    "5")
        ansible-playbook --ask-vault-pass -i openstack_inventory.py harvester.yaml;
        ;;
    "6")
        ansible-playbook --ask-vault-pass -i openstack_inventory.py processor.yaml;
        ;;
    "7")
        ansible-playbook --ask-vault-pass -i openstack_inventory.py client.yaml;
        ;;
    "8")
        ansible-playbook --ask-become-pass instance_setup.yaml;
        wait
        ansible-playbook --ask-vault-pass -i openstack_inventory.py full_setup.yaml;
        ;;
    *)
        echo "Invalid job number."
        ;;
esac