#
# Copyright (C) 2015-2016 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v3.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=alist
PKG_VERSION:=3.45.0
PKG_WEB_VERSION:=3.45.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/AlistGo/alist/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=224119ea5a3b43694e5342c460ab471d6477db1bf7ade5180d542a32363cb097

PKG_LICENSE:=GPL-3.0
PKG_LICENSE_FILE:=LICENSE
PKG_MAINTAINER:=sbwml <admin@cooluc.com>

define Download/$(PKG_NAME)-web
  FILE:=$(PKG_NAME)-web-$(PKG_WEB_VERSION).tar.gz
  URL_FILE:=dist.tar.gz
  URL:=https://github.com/AlistGo/alist-web/releases/download/$(PKG_WEB_VERSION)/
  HASH:=408b1822893ba6dd6bbeb4055d6c8b96c178d10f4fbb8e5696cf14dcc88dd2fb
endef

PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
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
  VERSION:=$(PKG_VERSION)-r$(PKG_RELEASE)
  DEPENDS:=$(GO_ARCH_DEPENDS)
endef

define Package/$(PKG_NAME)/description
  A file list program that supports multiple storage, powered by Gin and Solidjs.
endef
	
ifeq ($(filter aarch64 x86_64, $(ARCH)),)
  GO_PKG_EXCLUDES:=drivers/lark
endif

ifneq ($(CONFIG_USE_MUSL),)
  TARGET_CFLAGS += -D_LARGEFILE64_SOURCE
endif

define Build/Prepare
	$(call Build/Prepare/Default)
	$(TAR) --strip-components=1 -C $(PKG_BUILD_DIR)/public/dist -xzf $(DL_DIR)/$(PKG_NAME)-web-$(PKG_WEB_VERSION).tar.gz
	$(SED) 's_https://jsd.nn.ci/gh/alist-org/logo@main/logo.png_/assets/logo.png_g' $(PKG_BUILD_DIR)/public/dist/index.html
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

$(eval $(call Download,$(PKG_NAME)-web))
$(eval $(call BuildPackage,$(PKG_NAME)))
