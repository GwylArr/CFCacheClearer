

# CF Cache Clearer

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.CFCacheClearer?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.CFCacheClearer/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.CFCacheClearer?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.CFCacheClearer)
[![GitHub license](https://img.shields.io/github/license/GwylArr/CFCacheClearer?color=8AB803)](https://github.com/GwylArr/CFCacheClearer/blob/main/LICENSE)

Adds a dashboard to the Umbraco 17 backoffice that can purge the CloudFlare cache for either a full site or specific
routes.

It supports headless, multisite, and even remote sites that have nothing to do with the site you're on, just add them to the configuration.

Of course, only sites that are using CloudFlare Http caching are supported.

## Config

Zone ID and API token are required, get these from a CloudFlare admin.

```
"CFCacheClearer": {
    "Cloudflare": [
        {
            "ZoneId": "",
            "ApiToken": "",
            "BaseUrl":"https://www.example.com"
        }
    ],
    "Access": {
        "AllowedUserGroups": []
    }
}
```

### Massive thank you to Lottie Pitcher for https://github.com/LottePitcher/opinionated-package-starter which this is built from.
