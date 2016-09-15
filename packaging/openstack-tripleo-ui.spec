%global sname openstack-tripleo-ui
%global commit 6741f26b0c3a2d603ee53621ab14f0aed3ed78a3
%global shortcommit %(c=%{commit}; echo ${c:0:7})
%global checkout .%{shortcommit}git

Name:           %{sname}
Version:        1.0.1
Release:        0.2%{?checkout}%{?dist}
Summary:        TripleO UI --- GUI for the TripleO project
License:        ASL 2.0
URL:            http://tripleo.org
# Source0 is created by running "npm pack"
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{shortcommit}.tar.gz
Source1:        tripleo-ui.conf

BuildRequires:  nodejs
BuildRequires:  git
BuildRequires:  %{sname}-deps = 2
BuildArch:      noarch

%description

%prep
%autosetup -n package -S git

%build
rm -rf node_modules
ln -s /opt/%{name}-deps/node_modules .
npm run build

%install
mkdir -p %{buildroot}/%{_datadir}/%{name}
mkdir -p %{buildroot}/var/www/%{name}
mkdir -p %{buildroot}/etc/httpd/conf.d/
cp -rf dist %{buildroot}/var/www/%{name}/
cp -rf %{SOURCE1} %{buildroot}/etc/httpd/conf.d/%{sname}.conf

%files
%{_localstatedir}/www/%{sname}
%config(noreplace)  %{_sysconfdir}/httpd/conf.d/%{sname}.conf
%license LICENSE
%doc README.md

%changelog
* Tue Jul 26 2016 Honza Pokorny <honza@redhat.com> 1.0.1-0.2.6741f26git
- Add new dependencies
* Tue Jul 26 2016 Honza Pokorny <honza@redhat.com> 0.0.1-0.1.38664a1git
- First RPM
