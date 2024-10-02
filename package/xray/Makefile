include $(TOPDIR)/rules.mk

PKG_NAME:=xray-core
PKG_VERSION:=24.9.30
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/XTLS/Xray-core/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=0771120ddbf866fba44f2e8978bcc20f3843663f5726bd8db9e03e1a27e1212a

PKG_MAINTAINER:=Leo Zhao
PKG_LICENSE:=MPL-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DIR:=$(BUILD_DIR)/Xray-core-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0
PKG_BUILD_FLAGS:=no-mips16

GO_PKG:=github.com/xtls/xray-core
GO_PKG_BUILD_PKG:=github.com/xtls/xray-core/main
GO_PKG_LDFLAGS:=-s -w
GO_PKG_LDFLAGS_X:= \
	$(GO_PKG)/core.build=OpenWrt \
	$(GO_PKG)/core.version=$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/golang/golang-package.mk

define Package/xray-LZMA
  TITLE:=A platform for building proxies to bypass network restrictions
  SECTION:=net
  CATEGORY:=Network
  URL:=https://github.com/XTLS/Xray-core
  DEPENDS:=$(GO_ARCH_DEPENDS) +ca-bundle
endef

define Package/xray-LZMA/description
  Xray, Penetrates Everything. Also the best v2ray-core, with XTLS support. Fully compatible configuration.
  It secures your network connections and thus protects your privacy.
endef

ifneq ($(CONFIG_USE_MUSL),)
  TARGET_CFLAGS += -D_LARGEFILE64_SOURCE
endif

define Build/Compile
	$(eval GO_PKG_BUILD_PKG:=$(GO_PKG)/main)
	$(call GoPackage/Build/Compile)
	mv -f $(GO_PKG_BUILD_BIN_DIR)/main $(GO_PKG_BUILD_BIN_DIR)/xray
	$(STAGING_DIR_HOST)/bin/upx --lzma --best $(GO_PKG_BUILD_BIN_DIR)/xray || true
endef

define Package/xray-LZMA/install
	$(INSTALL_DIR) $(1)/usr/bin/
	$(INSTALL_BIN) $(GO_PKG_BUILD_BIN_DIR)/xray $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/xray
	$(INSTALL_DATA) ./ip_cn $(1)/etc/xray
	$(INSTALL_DATA) ./ip_reserve $(1)/etc/xray
	$(INSTALL_DATA) ./xray.nft $(1)/etc/xray
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./init_xray $(1)/etc/uci-defaults
	$(INSTALL_DIR) $(1)/etc/scripts
	$(INSTALL_BIN) ./updateGFW $(1)/etc/scripts
	$(INSTALL_DIR) $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./gfwlist.conf $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./apple.conf $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./forceproxy.conf $(1)/etc/dnsmasq.d
endef

$(eval $(call BuildPackage,xray-LZMA))
