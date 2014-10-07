# Vagrant Appliance #

The Vagrant box is a Debian 7 virtual machine image with a pre-configured Puppet Master, PuppetDB and Git repositories for both OpsTheatre backend and frontend. Users will be able to deploy the latest OpsTheatre and try it out without having the need to configure the dashboard and it's dependencies.

## 1. Requirements

* 512M free RAM for the Virtual Machine
* 3 GB of free disk space
* A 32-bit kernel

## 2. Download the Vagrant Software
### 2.1 – Download and Install Vagrant

* Follow [this guide](https://www.virtualbox.org/wiki/Downloads) in order to install VirtualBox. (We are using VirtualBox as the provider)
* Follow [this guide](http://www.vagrantup.com/downloads.html) in order to install Vagrant.

### 2.2 - Deploy the Virtual Machine

Run the following commands to get the vagrant up and working:

Create a Vagrant directory:

  `$ mkdir opstheatre`

Create a Vagrantfile:

  `$ cd opstheatre; vagrant init`

Replace the contents of the Vagrantfile with the following:

    # -*- mode: ruby -*-
    # vi: set ft=ruby :
    
    VAGRANTFILE_API_VERSION = "2"
    
    Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
      config.vm.box = "opstheatre/opstheatre-demo"
      
      config.vm.provider "virtualbox" do |vb|
        vb.gui = false
      end
      
      config.vm.define :opstheatre do |ops|
        ops.vm.hostname = 'opstheatre.olindata.com'
        ops.vm.network "private_network", ip: "192.168.56.10"
      end
      
      config.vm.provision "shell",
        inline: "/root/setup.sh"
        
      config.vm.post_up_message = "OpsTheatre is now running and should be accessible from your browser at address http://192.168.56.10:3030"
    end

### 2.3 – Start the Appliance

Deploy Vagrant!:

  `$ vagrant up opstheatre`

    Bringing machine 'opstheatre' up with 'virtualbox' provider...
    ==> opstheatre: Importing base box 'opstheatre'...
    ==> opstheatre: Matching MAC address for NAT networking...
    ==> opstheatre: Setting the name of the VM: vagrant_opstheatre_1411390017940_71794
    ==> opstheatre: Clearing any previously set network interfaces...
    ==> opstheatre: Preparing network interfaces based on configuration...
        opstheatre: Adapter 1: nat
        opstheatre: Adapter 2: hostonly
    ==> opstheatre: Forwarding ports...
        opstheatre: 22 => 2222 (adapter 1)
    ==> opstheatre: Booting VM...
    ==> opstheatre: Waiting for machine to boot. This may take a few minutes...
        opstheatre: SSH address: 127.0.0.1:2222
        opstheatre: SSH username: vagrant
        opstheatre: SSH auth method: private key
        opstheatre: Warning: Connection timeout. Retrying...
    ==> opstheatre: Machine booted and ready!
    GuestAdditions 4.3.16 running --- OK.
    ==> opstheatre: Checking for guest additions in VM...
    ==> opstheatre: Setting hostname...
    ==> opstheatre: Configuring and enabling network interfaces...
    ==> opstheatre: Mounting shared folders...
        opstheatre: /vagrant => /Volumes/data/git/ops-theatre/scripts/vagrant
    ==> opstheatre: Running provisioner: shell...
        opstheatre: Running: inline script
    ==> opstheatre: stdin: is not a tty
    ==> opstheatre: ##### Updating puppet master host record #####
    ==> opstheatre: host { 'opstheatre.olindata.com':
    ==> opstheatre:   ensure => 'present',
    ==> opstheatre:   ip     => '10.0.2.15',
    ==> opstheatre:   target => '/etc/hosts',
    ==> opstheatre: }
    ==> opstheatre: Starting PostgreSQL 9.1 database server:
    ==> opstheatre:  main
    ==> opstheatre: .
    ==> opstheatre: Starting web server: apache2
    ==> opstheatre: .
    ==> opstheatre:
    ==> opstheatre: ##### Please wait... #####
    ==> opstheatre:
    ==> opstheatre: ##### Updating git repository for ops-theatre #####
    ==> opstheatre: From https://github.com/olindata/ops-theatre
    ==> opstheatre:  * branch            HEAD       -> FETCH_HEAD
    ==> opstheatre: Already up-to-date.
    ==> opstheatre:
    ==> opstheatre: ##### Starting ops-theatre process #####
    ==> opstheatre:
    ==> opstheatre: ##### Updating git repository for ops-theatre-frontend #####
    ==> opstheatre: From https://github.com/olindata/ops-theatre-frontend
    ==> opstheatre:  * branch            HEAD       -> FETCH_HEAD
    ==> opstheatre: Already up-to-date.
    ==> opstheatre:
    ==> opstheatre: ##### Starting ops-theatre-frontend process #####
    ==> opstheatre:
    ==> opstheatre: ##### You can now browse to http://192.168.56.10:3030
    ==> opstheatre: ##### on your browser to try OpsTheatre!
    
    ==> opstheatre: Machine 'opstheatre' has a post `vagrant up` message. This is a message
    ==> opstheatre: from the creator of the Vagrantfile, and not from Vagrant itself:
    ==> opstheatre:
    ==> opstheatre: OpsTheatre is now running and should be accessible from your browser at address http://192.168.56.10:3030

## 3. Take a Test Drive

Open your browser and insert the URL http://192.168.56.10:3030 on the address bar. You will be presented with the OpsTheatre login page.

![](images/login-page.png)
