Vagrant.configure("2") do |config|

    # base box - ubuntu 14.04 lts
    config.vm.box = "ubuntu/trusty64"

    # networking:
    #  9200 - rest api port
    #  9300 - java api port
    #  3000:3000 - nodejs http port
    #
    config.vm.network :forwarded_port, guest:9200, host: 9200, auto_correct: true
    config.vm.network :forwarded_port, guest:9300, host: 9300, auto_correct: true
    config.vm.network :forwarded_port, guest:3000, host: 3000, auto_correct: true

    # set proper name and ram
    config.vm.provider "virtualbox" do |v|
        v.name = "Songster Development Vagrantbox"
        v.customize ["modifyvm", :id, "--memory", "1024"]
    end

    # run our provision script to install elasticsearch
    config.vm.provision "shell" do |s|
        s.path = "misc/provision.sh"
    end
end
