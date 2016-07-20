%global sname tripleo-ui

Name:           openstack-%{sname}
Version:        0.0.1
Release:        2%{?dist}
Summary:        TripleO UI --- GUI for the TripleO project
License:        ASL 2.0
URL:            http://tripleo.org
# Source0 is created by running "npm pack"
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{version}.tgz

BuildRequires:  nodejs
BuildRequires:  git
BuildRequires:  openstack-%{sname}-deps = 0.0.1
BuildArch:      noarch

%description

%prep
%autosetup -n package -S git

%build
rm -rf node_modules
ln -s /opt/%{name}/node_modules .
npm run build

%install
mkdir -p %{buildroot}/%{_datadir}/%{name}
mkdir -p %{buildroot}/var/www/%{name}
mkdir -p %{buildroot}/etc/httpd/conf.d/
cp -rf package/dist %{buildroot}/var/www/%{name}/
cp -rf package/packaging/tripleo-ui.conf %{buildroot}/etc/httpd/conf.d/

%files
%{_localstatedir}/www/%{sname}
%config(noreplace)  %{_sysconfdir}/httpd/conf.d/%{sname}.conf
%license LICENSE
%doc README.md

%changelog
* Thu Jul 26 2016 Honza Pokorny <honza@redhat.com> %{version}-%{release}
- First RPM
