include $(TOPDIR)/rules.mk

PKG_NAME:=xray-core
PKG_VERSION:=25.10.15
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/XTLS/Xray-core.git
PKG_SOURCE_VERSION:=b69a376aa1b61ad94c9c05b2c2cd263567b8cc23
PKG_SOURCE_SUBDIR:=Xray-core-$(PKG_VERSION)

PKG_MAINTAINER:=skygunner5
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

define Package/dline
  TITLE:=Dedicated Line
  SECTION:=net
  CATEGORY:=Network
  URL:=https://github.com/XTLS/Xray-core
  VERSION:=$(PKG_VERSION)-r$(PKG_RELEASE)
  DEPENDS:=$(GO_ARCH_DEPENDS) +ca-bundle
endef

define Package/dline/description
  Dedicated Line
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

define Package/dline/install
	$(INSTALL_DIR) $(1)/usr/bin/
	$(INSTALL_BIN) $(GO_PKG_BUILD_BIN_DIR)/xray $(1)/usr/bin/dline
	$(INSTALL_DIR) $(1)/etc/dline
	$(INSTALL_DATA) ./ip_cnv4 $(1)/etc/dline
	$(INSTALL_DATA) ./ip_cnv6 $(1)/etc/dline
	$(INSTALL_DATA) ./dline.nft $(1)/etc/dline
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./init_dline $(1)/etc/uci-defaults
	$(INSTALL_DIR) $(1)/etc/scripts
	$(INSTALL_BIN) ./updateGFW $(1)/etc/scripts
	$(INSTALL_DIR) $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./gfwlist.conf $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./forceproxy.conf $(1)/etc/dnsmasq.d
endef

$(eval $(call BuildPackage,dline))
