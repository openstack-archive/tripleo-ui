%global sname openstack-tripleo-ui-deps
%global commit 38664a13b4a74f9bcca3384f6ad4184a298db140
%global shortcommit %(c=%{commit}; echo ${c:0:7})

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
#   $ git checkout %{commit}
#   $ npm install
#   $ tar czf tripleo-ui-deps-%{shortcommit}.tar.gz node_modules
Source0:        tripleo-ui-deps-%{shortcommit}.tar.gz

BuildRequires:  nodejs
BuildRequires:  git
Requires:       %{sname}-babel = %{version}-%{release}
Requires:       %{sname}-phantomjs = %{version}-%{release}
Requires:       %{sname}-webpack = %{version}-%{release}

%description
Source dependencies for TripleO UI

%package babel
Summary:        Source dependencies for TripleO UI (babel)

%description babel
Source dependencies for TripleO UI (babel)

%package phantomjs
Summary:        Source dependencies for TripleO UI (phantomjs)

%description phantomjs
Source dependencies for TripleO UI (phantomjs)

%package webpack
Summary:        Source dependencies for TripleO UI (webpack)

%description webpack
Source dependencies for TripleO UI (webpack)

%prep
%autosetup -n node_modules -S git

%build

%install
mkdir -p %{buildroot}/opt/%{name}/
cp -rf %{_builddir}/node_modules %{buildroot}/opt/%{name}/

%files
/opt/%{name}/
%exclude /opt/%{name}/node_modules/babel*
%exclude /opt/%{name}/node_modules/phantomjs*
%exclude /opt/%{name}/node_modules/webpack*

%files babel
/opt/%{name}/node_modules/babel*

%files phantomjs
/opt/%{name}/node_modules/phantomjs*

%files webpack
/opt/%{name}/node_modules/webpack*

%changelog
* Tue Jul 26 2016 Honza Pokorny <honza@redhat.com> 1-2
- First RPM
