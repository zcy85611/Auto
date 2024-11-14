include $(TOPDIR)/rules.mk

PKG_NAME:=rmfakecloud
PKG_VERSION:=0.0.19
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/ddvk/rmfakecloud.git
PKG_SOURCE_VERSION:=4af294b128939c44439a4579e665ab9592f74a76
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)

PKG_MAINTAINER:=Leo Zhao
PKG_LICENSE:=MPL-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0
PKG_BUILD_FLAGS:=no-mips16

GO_PKG:=github.com/ddvk/rmfakecloud
GO_PKG_BUILD_PKG:=github.com/ddvk/rmfakecloud/cmd/rmfakecloud
GO_PKG_LDFLAGS:=-s -w
GO_PKG_LDFLAGS_X:= \
	$(GO_PKG)/core.build=OpenWrt \
	$(GO_PKG)/core.version=$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/golang/golang-package.mk

define Package/$(PKG_NAME)
  TITLE:=fakecloud server for reMarkable
  SECTION:=net
  CATEGORY:=Network
  URL:=https://github.com/ddvk/rmfakecloud
  VERSION:=$(PKG_VERSION)-r$(PKG_RELEASE)
  DEPENDS:=$(GO_ARCH_DEPENDS)
endef

define Package/$(PKG_NAME)/description
  fakecloud server for reMarkable
endef

ifneq ($(CONFIG_USE_MUSL),)
  TARGET_CFLAGS += -D_LARGEFILE64_SOURCE
endif

define Build/Compile
	$(call GoPackage/Build/Configure)
	yarn --cwd $(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)/ui	
	cp $(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)/ui/node_modules/pdfjs-dist/build/pdf.worker.js $(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)/ui/public/
	yarn --cwd $(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)/ui build
	$(call GoPackage/Build/Compile)
	mv -f $(GO_PKG_BUILD_BIN_DIR)/rmfakecloud $(GO_PKG_BUILD_BIN_DIR)/rMcloud
	$(STAGING_DIR_HOST)/bin/upx --lzma --best $(GO_PKG_BUILD_BIN_DIR)/rMcloud || true
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin/
	$(INSTALL_BIN) $(GO_PKG_BUILD_BIN_DIR)/rMcloud $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/nginx/conf.d
	$(INSTALL_BIN) ./rMcloud_server.conf $(1)/etc/nginx/conf.d
	$(INSTALL_DIR) $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./rMcloud.conf $(1)/etc/dnsmasq.d
	$(INSTALL_DATA) ./proxy.bundle.crt $(1)/etc/nginx/conf.d
	$(INSTALL_DATA) ./proxy.key $(1)/etc/nginx/conf.d
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
