%global sname openstack-tripleo-ui
%global gitsha 38664a1

Name:           %{sname}
Version:        0.0.1
Release:        2%{?dist}
Summary:        TripleO UI --- GUI for the TripleO project
License:        ASL 2.0
URL:            http://tripleo.org
# Source0 is created by running "npm pack"
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{gitsha}.tar.gz
Source1:        tripleo-ui.conf

BuildRequires:  nodejs
BuildRequires:  git
BuildRequires:  %{sname}-deps = 1
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
* Tue Jul 26 2016 Honza Pokorny <honza@redhat.com> 0.0.1-2
- First RPM
