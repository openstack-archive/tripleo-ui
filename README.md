# Environment setup

## Prerequisities

1. Setup TripleO http://docs.openstack.org/developer/tripleo-docs/index.html
2. install nodejs and npm ```sudo yum install nodejs``` (probably requires EPEL) In case of problems refer to https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager#enterprise-linux-and-fedora
3. To compile and install native addons from npm you may also need to install build tools:
   ```yum install gcc-c++ make```


### Install and run Validations API service on Undercloud machine

If the Validations service was not installed automatically on your
undercloud, you can set it up by using the following guide:

https://github.com/openstack/tripleo-common/blob/master/README.rst#validations


### Make Undercloud API services available when running app from laptop

UI requires the openstack API services to be publicly accessible.

#### On virt host (lab machine)
```
BM_NETWORK_CIDR=192.0.2.0/24
ROUTE_DEV=virbr0
SEED_IP=<UNDERCLOUD_VM_IP>
sudo ip route replace $BM_NETWORK_CIDR dev $ROUTE_DEV via $SEED_IP
```

#### On laptop
```
export VIRT_IP=<VIRT_HOST_IP>
export UNDERCLOUD_IP=192.0.2.1
sudo iptables -t nat -A OUTPUT -d $UNDERCLOUD_IP -j DNAT --to-destination 127.0.0.1
```

Copy dist/tripleo_ui_config.js.sample to dist/tripleo_ui_config.js, uncomment the lines for keystone, tripleo, validations and zaqar_websocket_url, and add the urls where these services can be accessed.
You can set values for the other services as well to override the values coming from the keystone serviceCatalog.

Setup ssh tunnel for OpenStack API Services

```ssh stack@$VIRT_IP -L 8774:$UNDERCLOUD_IP:8774 -L 9292:$UNDERCLOUD_IP:9292 -L 8777:$UNDERCLOUD_IP:8777 -L 9696:$UNDERCLOUD_IP:9696 -L 6385:$UNDERCLOUD_IP:6385 -L 8004:$UNDERCLOUD_IP:8004 -L 5000:$UNDERCLOUD_IP:5000 -L 5001:$UNDERCLOUD_IP:5001 -L 8080:$UNDERCLOUD_IP:8080 -L 8585:$UNDERCLOUD_IP:8585  -L 35357:$UNDERCLOUD_IP:35357```

Note that those ports need to be enabled in Undercloud VM's iptables (this should be already in place from undercloud installation, except for the validations API port 5001):

```
ssh root@<undercloud_vm_ip>
vi /etc/sysconfig/iptables
```
add
```
-A INPUT -p tcp -m tcp --dport 9696 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 8777 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 8080 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 5001 -j ACCEPT # enable Validations API port
...
```
below 8585 rule and restart iptables

```systemctl restart iptables```

### Configure CORS for OpenStack services

#### Keystone - pastedeploy method:
```
ssh ssh root@<undercloud_vm_ip>
vi /usr/share/keystone/keystone-dist-paste.ini
```
add cors filter
```
[filter:cors]
paste.filter_factory = oslo_middleware.cors:filter_factory
allowed_origin=http://localhost:3000
max_age=3600
allow_methods=GET,POST,PUT,DELETE
allow_headers=Content-Type,Cache-Control,Content-Language,Expires,Last-Modified,Pragma,X-Auth-Token
expose_headers=Content-Type,Cache-Control,Content-Language,Expires,Last-Modified,Pragma
```
and run the filter on all pipelines like this example:
```
[pipeline:public_api]
# The last item in this pipeline must be public_service or an equivalent
# application. It cannot be a filter.
pipeline = cors sizelimit url_normalize request_id build_auth_context token_auth admin_token_auth json_body ec2_extension user_crud_extension public_service
```
and restart keystone ```systemctl restart openstack-keystone```

#### Ironic - using ironic.conf

```
ssh root@<undercloud_vm_ip>
vi /etc/ironic/ironic.conf
```

add

```
[cors]
allowed_origin=http://localhost:3000
max_age=3600
allow_methods=GET,POST,PUT,DELETE
allow_headers=Content-Type,Cache-Control,Content-Language,Expires,Last-Modified,Pragma,X-Auth-Token
expose_headers=Content-Type,Cache-Control,Content-Language,Expires,Last-Modified,Pragma
```

Temporary: set ```auth_strategy=noauth```

and restart ironic ```systemctl restart openstack-ironic-api```


## Running the App in Development environment

1. ```git clone https://github.com/openstack/tripleo-ui.git```
2. ```cd tripleo-ui```
4. Install dependencies ```npm install```
5. Start the development server with ```npm start```
5. Optionally start Karma to run tests after every change ```npm run test:watch```
6. Navigate to ```http://<machine_hostname>:3000/```

#### NPM install troubleshooting

In case of errors during ```npm install```, remove node_modules dir and clean npm cache
```npm cache clean```. Then run ```npm install``` again.


## Contributing

Use OpenStack Gerrit for patches and reviews (http://docs.openstack.org/infra/manual/developers.html).

1. ```git clone https://github.com/openstack/tripleo-ui.git``` (if you didn't already)
2. Install git-review ```sudo dnf install git-review```
3. Setup Gerrit by running ```git review -s```
4. Develop on feature-branch locally
5. Run ```git review``` to push patch for review.
6. Review and merge patches on OpenStack Gerrit: https://review.openstack.org/#/q/project:openstack/tripleo-ui


## Tests

#### Single test run:

- ```npm test``` (alternatively run ```karma start --single-run```)
- ```npm run lint``` to run ESLint

(Info on Linting setup here: https://medium.com/@dan_abramov/lint-like-it-s-2015-6987d44c5b48,
.eslintrc rules tweaks here: http://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/)


#### Style guide and conventions

Style guide: https://github.com/airbnb/javascript

Multiple words in folder names should be separated by an underscore:

```
src/js/components/environment_configuration
```

#### Tests during development:

Start Karma to run tests after every change ```npm run test:watch```


#### Debugging tests

1. option:
  - use ```console.log``` in the test and see the output in karma server output
2. option:
  - install karma-chrome-launcher npm module ```npm install karma-chrome-launcher --save-dev```
  - replace/add 'Chrome' to browsers in ```karma.conf.js```
  - now Karma will launch Chrome to run the tests
  - use ```debugger;``` statement in test code to add breakpoints
  - in Karma Chrome window click 'debug' button and debug in chrome developer tools as usual
  - optionally you can use karma-jasmine-html-reporter for better test output (https://www.npmjs.com/package/karma-jasmine-html-reporter)
  - make sure you don't push those changes to ```karma.conf.js``` and ```package.json``` as part of your patch


## Documentation

Use JSDoc docstrings in code to provide source for autogenerated documentation (http://usejsdoc.org/).

## Basic OpenStack API Usage

http://docs.openstack.org/api/quick-start/content/index.html#authenticate
