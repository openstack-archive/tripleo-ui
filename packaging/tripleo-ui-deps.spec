%global sname tripleo-ui-deps
%global gitsha 38664a1

Name:           %{sname}
Version:        1
Release:        2%{?dist}
Summary:        Source dependencies for TripleO UI
License:        ASL 2.0
URL:            http://tripleo.org
# Source0 is created by running "npm pack".
# This will also bundle node_modules inside the tarball.
Source0:        http://tarballs.openstack.org/tripleo-ui/tripleo-ui-%{gitsha}.tar.gz

BuildRequires:  nodejs
BuildRequires:  git
BuildArch:      noarch

%description

%prep
%autosetup -n package -S git

%build
tar xzf node_modules.tar.gz

%install
mkdir -p %{buildroot}/opt/%{name}/
cp -rf %{_builddir}/package/node_modules %{buildroot}/opt/%{name}/

%files
%license LICENSE
%doc README.md

%changelog
* Thu Jul 26 2016 Honza Pokorny <honza@redhat.com> 1-2
- First RPM
