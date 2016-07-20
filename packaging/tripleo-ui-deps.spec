%global sname tripleo-ui-deps

Name:           openstack-%{sname}
Version:        0.0.1
Release:        2%{?dist}
Summary:        Source dependencies for TripleO UI
License:        ASL 2.0
URL:            http://tripleo.org
# Source0 is created by running "npm pack"
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{version}.tgz

BuildRequires:  nodejs
BuildRequires:  git
BuildArch:      noarch

%description

%prep
%autosetup -n package -S git

%build
tar xzf node_modules.tgz

%install
mkdir -p %{buildroot}/opt/%{name}/
cp -rf {%_builddir}/package/node_modules %{_buildroot}/opt/%{name}/

%files
%license LICENSE
%doc README.md

%changelog
* Thu Jul 26 2016 Honza Pokorny <honza@redhat.com> 0.0.1-2
- First RPM
