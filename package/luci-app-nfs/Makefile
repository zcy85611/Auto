#
# Copyright (C) 2008-2014 The LuCI Team <luci@lists.subsignal.org>
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for NFS
LUCI_DEPENDS:=+kmod-fs-nfs +kmod-fs-nfs-v4 +kmod-fs-nfsd \
              +kmod-fs-nfs-common +kmod-fs-nfs-common-rpcsec \
              +kmod-fs-nfs-v3 +kmod-fs-exportfs \
              +nfs-kernel-server +nfs-kernel-server-utils +nfs-utils
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
