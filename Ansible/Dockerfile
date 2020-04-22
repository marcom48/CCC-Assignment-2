FROM ubuntu

WORKDIR /root/ccc

# Configure to use Ansible with Python3.
RUN apt-get update && apt-get install -y python3-pip openssh-client vim
RUN pip3 install ansible

# Generate Keypair
RUN ssh-keygen -f ~/Marco_Docker -P COMP90024

COPY . .
