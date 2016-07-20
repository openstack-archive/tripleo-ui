%global sname tripleo-ui-deps
%global gitsha 38664a1

Name:           %{sname}
Version:        1
Release:        2%{?dist}
Summary:        Source dependencies for TripleO UI
License:        ASL 2.0
URL:            http://tripleo.org

# The source for this package was pulled from git.  Use the following commands
# to generate the tarball.
#
#   $ git clone https://github.com/openstack/tripleo-ui.git
#   $ cd tripleo-ui
#   $ git checkout 38664a1
#   $ npm install
#   $ tar czf tripleo-ui-deps-38664a1.tar.gz node_modules
Source0:        tripleo-ui-deps-%{gitsha}.tar.gz

BuildRequires:  nodejs
BuildRequires:  git
BuildArch:      noarch

%description

%prep
%autosetup -n node_modules -S git

%build

%install
mkdir -p %{buildroot}/opt/%{name}/
cp -rf %{_builddir}/node_modules %{buildroot}/opt/%{name}/

%files
%license LICENSE
%doc README.md

%changelog
* Thu Jul 26 2016 Honza Pokorny <honza@redhat.com> 1-2
- First RPM
