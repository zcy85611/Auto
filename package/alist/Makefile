#
# Copyright (C) 2015-2016 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v3.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=alist
PKG_VERSION:=3.34.0
PKG_WEB_VERSION:=3.34.0
PKG_RELEASE:=6

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/alist-org/alist/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=843d6ccc74210d6541d0c976c4b396381ca98a855a9c75b2e753e94c7f78cbad

PKG_LICENSE:=GPL-3.0
PKG_LICENSE_FILE:=LICENSE
PKG_MAINTAINER:=sbwml <admin@cooluc.com>

define Download/$(PKG_NAME)-web
  FILE:=$(PKG_NAME)-web-$(PKG_WEB_VERSION).tar.gz
  URL_FILE:=dist.tar.gz
  URL:=https://github.com/alist-org/alist-web/releases/download/$(PKG_WEB_VERSION)/
  HASH:=82a634c20df88b0ce385d029d0a23a8047b825273621d08c276232fb3309442c
endef

PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0
PKG_BUILD_FLAGS:=no-mips16

GO_PKG:=github.com/alist-org/alist
GO_PKG_LDFLAGS:=-w -s
GO_PKG_LDFLAGS_X:= \
	$(GO_PKG)/v3/internal/conf.Version=v$(PKG_VERSION)-$(ARCH) \
	$(GO_PKG)/v3/internal/conf.WebVersion=$(PKG_WEB_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/golang/golang-package.mk

define Package/$(PKG_NAME)
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=Web Servers/Proxies
  TITLE:=A file list program that supports multiple storage
  URL:=https://alist-doc.nn.ci/
  DEPENDS:=$(GO_ARCH_DEPENDS)
endef

define Package/$(PKG_NAME)/description
  A file list program that supports multiple storage, powered by Gin and Solidjs.
endef

ifeq ($(ARCH),arm)
  ARM_CPU_FEATURES:=$(word 2,$(subst +,$(space),$(call qstrip,$(CONFIG_CPU_TYPE))))
  ifeq ($(ARM_CPU_FEATURES),)
    TARGET_CFLAGS:=
    TARGET_LDFLAGS:=
  endif
endif

ifneq ($(CONFIG_USE_MUSL),)
  TARGET_CFLAGS += -D_LARGEFILE64_SOURCE
endif

define Build/Prepare
	$(call Build/Prepare/Default)
	$(eval $(call Download,$(PKG_NAME)-web))
	$(TAR) --strip-components=1 -C $(PKG_BUILD_DIR)/public/dist -xzf $(DL_DIR)/$(PKG_NAME)-web-$(PKG_WEB_VERSION).tar.gz
	$(CP) ./files/assets/. $(PKG_BUILD_DIR)/public/dist/assets/
endef

define Build/Compile
	$(call GoPackage/Build/Compile)
	$(STAGING_DIR_HOST)/bin/upx --lzma --best $(GO_PKG_BUILD_BIN_DIR)/alist
endef


define Package/$(PKG_NAME)/install
	$(call GoPackage/Package/Install/Bin,$(PKG_INSTALL_DIR))
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/alist $(1)/usr/bin
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
