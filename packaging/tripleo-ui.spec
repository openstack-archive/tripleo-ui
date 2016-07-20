Name:           tripleo-ui
Version:        0.0.1
Release:        2%{?dist}
Summary:        TripleO UI --- GUI for the TripleO project
License:        ASL 2.0
URL:            http://tripleo.org
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{version}.tgz

BuildRequires:  nodejs
BuildRequires:  systemd
BuildArch:      noarch

%description

%prep
%autosetup -n package

%build
rm -rf node_modules
tar xzf node_modules.tar.gz
npm prune --production
npm run build

%install
mkdir -p %{buildroot}/%{_datadir}/%{name}
mkdir -p %{buildroot}/var/www/%{name}
mkdir -p %{buildroot}/etc/httpd/conf.d/
cp -rf %{_builddir}/package/dist %{buildroot}/var/www/%{name}/
cp -rf %{_builddir}/package/packaging/tripleo-ui.conf %{buildroot}/etc/httpd/conf.d/

%files
/var/www/tripleo-ui/dist/*
/etc/httpd/conf.d/tripleo-ui.conf
%license LICENSE
%doc README.md

%postun
%systemd_postun_with_restart httpd.service

%changelog
* Thu Jul 14 2016 tripleouirpm
