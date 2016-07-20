%global sname tripleo-ui

Name:           openstack-%{sname}
Version:        0.0.1
Release:        2%{?dist}
Summary:        TripleO UI --- GUI for the TripleO project
License:        ASL 2.0
URL:            http://tripleo.org
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{version}.tgz

Requires:  nodejs
BuildRequires:  git
BuildArch:      noarch

%description

%prep
%autosetup -n package -S git

%build
tar xzf node_modules.tar.gz
npm run build

%install
mkdir -p %{buildroot}/%{_datadir}/%{name}
mkdir -p %{buildroot}/var/www/%{name}
mkdir -p %{buildroot}/etc/httpd/conf.d/
cp -rf %{_builddir}/package/dist %{buildroot}/var/www/%{name}/
cp -rf %{_builddir}/package/packaging/tripleo-ui.conf %{buildroot}/etc/httpd/conf.d/

%files
%{_localstatedir}/www/%{sname}
%config(noreplace)  %{_sysconfdir}/httpd/conf.d/%{sname}.conf
%license LICENSE
%doc README.md

%changelog
* Thu Jul 26 2016 Honza Pokorny <honza@redhat.com> 0.0.1
- First RPM
