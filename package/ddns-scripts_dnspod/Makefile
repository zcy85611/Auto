include $(TOPDIR)/rules.mk

PKG_NAME:=ddns-scripts_dnspod
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_LICENSE:=GPLv2
PKG_MAINTAINER:=Leo_Zhao

PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk

define Build/Prepare
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/$(PKG_NAME)
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=IP Addresses and Names
	TITLE:=DDNS extension for extension for Dnspod/Alidns
	PKGARCH:=all
	DEPENDS:=+ddns-scripts +wget-ssl +ca-bundle
endef

define Package/$(PKG_NAME)/description
	DDNS extension for extension for Dnspod/Alidns
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/lib/ddns
	$(INSTALL_BIN) ./*.sh $(1)/usr/lib/ddns
	$(INSTALL_DIR) $(1)/usr/share/ddns/default
	$(INSTALL_DATA) ./*.json $(1)/usr/share/ddns/default
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
