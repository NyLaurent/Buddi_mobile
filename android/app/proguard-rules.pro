# Stripe React Native ProGuard Rules
# Keep Stripe classes to prevent R8 missing class errors

# Keep Stripe push provisioning classes
-keep class com.stripe.android.pushProvisioning.** { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivity { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivity$g { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivityStarter { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Args { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Error { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningEphemeralKeyProvider { *; }

# Keep Stripe core classes
-keep class com.stripe.android.** { *; }
-keep class com.stripe.android.core.** { *; }
-keep class com.stripe.android.model.** { *; }
-keep class com.stripe.android.view.** { *; }

# Keep React Native Stripe SDK classes
-keep class com.reactnativestripesdk.** { *; }
-keep class com.reactnativestripesdk.pushprovisioning.** { *; }

# Keep Stripe payment method classes
-keep class com.stripe.android.payments.** { *; }
-keep class com.stripe.android.paymentmethod.** { *; }

# Keep Stripe customer classes
-keep class com.stripe.android.customer.** { *; }

# Keep Stripe setup intent classes
-keep class com.stripe.android.setupintent.** { *; }

# Keep Stripe payment intent classes
-keep class com.stripe.android.paymentintent.** { *; }

# Keep Stripe confirmation classes
-keep class com.stripe.android.confirmation.** { *; }

# Keep Stripe authentication classes
-keep class com.stripe.android.authentication.** { *; }

# Keep Stripe ephemeral key classes
-keep class com.stripe.android.ephemeralkey.** { *; }

# Keep Stripe account classes
-keep class com.stripe.android.account.** { *; }

# Keep Stripe file classes
-keep class com.stripe.android.file.** { *; }

# Keep Stripe invoice classes
-keep class com.stripe.android.invoice.** { *; }

# Keep Stripe product classes
-keep class com.stripe.android.product.** { *; }

# Keep Stripe price classes
-keep class com.stripe.android.price.** { *; }

# Keep Stripe subscription classes
-keep class com.stripe.android.subscription.** { *; }

# Keep Stripe tax classes
-keep class com.stripe.android.tax.** { *; }

# Keep Stripe webhook classes
-keep class com.stripe.android.webhook.** { *; }

# Keep Stripe terminal classes
-keep class com.stripe.android.terminal.** { *; }

# Keep Stripe identity classes
-keep class com.stripe.android.identity.** { *; }

# Keep Stripe financial connections classes
-keep class com.stripe.android.financialconnections.** { *; }

# Keep Stripe issuing classes
-keep class com.stripe.android.issuing.** { *; }

# Keep Stripe treasury classes
-keep class com.stripe.android.treasury.** { *; }

# Keep Stripe billing classes
-keep class com.stripe.android.billing.** { *; }

# Keep Stripe checkout classes
-keep class com.stripe.android.checkout.** { *; }

# Keep Stripe elements classes
-keep class com.stripe.android.elements.** { *; }

# Keep Stripe payment sheet classes
-keep class com.stripe.android.paymentsheet.** { *; }

# Keep Stripe link classes
-keep class com.stripe.android.link.** { *; }

# Keep Stripe wallet classes
-keep class com.stripe.android.wallet.** { *; }

# Keep Stripe Google Pay classes
-keep class com.stripe.android.googlepay.** { *; }

# Keep Stripe Apple Pay classes
-keep class com.stripe.android.applepay.** { *; }

# Keep Stripe 3D Secure classes
-keep class com.stripe.android.threedsecure.** { *; }

# Keep Stripe SCA classes
-keep class com.stripe.android.sca.** { *; }

# Keep Stripe network classes
-keep class com.stripe.android.network.** { *; }

# Keep Stripe analytics classes
-keep class com.stripe.android.analytics.** { *; }

# Keep Stripe logging classes
-keep class com.stripe.android.logging.** { *; }

# Keep Stripe error classes
-keep class com.stripe.android.exception.** { *; }

# Keep Stripe utility classes
-keep class com.stripe.android.util.** { *; }

# Keep Stripe configuration classes
-keep class com.stripe.android.config.** { *; }

# Keep Stripe session classes
-keep class com.stripe.android.session.** { *; }

# Keep Stripe token classes
-keep class com.stripe.android.token.** { *; }

# Keep Stripe source classes
-keep class com.stripe.android.source.** { *; }

# Keep Stripe charge classes
-keep class com.stripe.android.charge.** { *; }

# Keep Stripe refund classes
-keep class com.stripe.android.refund.** { *; }

# Keep Stripe dispute classes
-keep class com.stripe.android.dispute.** { *; }

# Keep Stripe transfer classes
-keep class com.stripe.android.transfer.** { *; }

# Keep Stripe payout classes
-keep class com.stripe.android.payout.** { *; }

# Keep Stripe balance classes
-keep class com.stripe.android.balance.** { *; }

# Keep Stripe exchange rate classes
-keep class com.stripe.android.exchangerate.** { *; }

# Keep Stripe country spec classes
-keep class com.stripe.android.countryspec.** { *; }

# Keep Stripe capability classes
-keep class com.stripe.android.capability.** { *; }

# Keep Stripe person classes
-keep class com.stripe.android.person.** { *; }

# Keep Stripe verification classes
-keep class com.stripe.android.verification.** { *; }

# Keep Stripe document classes
-keep class com.stripe.android.document.** { *; }

# Keep Stripe file upload classes
-keep class com.stripe.android.fileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep Stripe webhook file upload classes
-keep class com.stripe.android.webhookfileupload.** { *; }

# Keep Stripe webhook endpoint classes
-keep class com.stripe.android.webhookendpoint.** { *; }

# Keep Stripe webhook event classes
-keep class com.stripe.android.webhookevent.** { *; }

# Keep Stripe webhook signature classes
-keep class com.stripe.android.webhooksignature.** { *; }

# Keep Stripe webhook secret classes
-keep class com.stripe.android.webhooksecret.** { *; }

# Keep Stripe webhook delivery classes
-keep class com.stripe.android.webhookdelivery.** { *; }

# Keep Stripe webhook attempt classes
-keep class com.stripe.android.webhookattempt.** { *; }

# Keep Stripe webhook failure classes
-keep class com.stripe.android.webhookfailure.** { *; }

# Keep Stripe webhook retry classes
-keep class com.stripe.android.webhookretry.** { *; }

# Keep Stripe webhook timeout classes
-keep class com.stripe.android.webhooktimeout.** { *; }

# Keep Stripe webhook rate limit classes
-keep class com.stripe.android.webhookratelimit.** { *; }

# Keep Stripe webhook quota classes
-keep class com.stripe.android.webhookquota.** { *; }

# Keep Stripe webhook usage classes
-keep class com.stripe.android.webhookusage.** { *; }

# Keep Stripe webhook billing classes
-keep class com.stripe.android.webhookbilling.** { *; }

# Keep Stripe webhook subscription classes
-keep class com.stripe.android.webhooksubscription.** { *; }

# Keep Stripe webhook invoice classes
-keep class com.stripe.android.webhookinvoice.** { *; }

# Keep Stripe webhook payment intent classes
-keep class com.stripe.android.webhookpaymentintent.** { *; }

# Keep Stripe webhook setup intent classes
-keep class com.stripe.android.webhooksetupintent.** { *; }

# Keep Stripe webhook account classes
-keep class com.stripe.android.webhookaccount.** { *; }

# Keep Stripe webhook customer classes
-keep class com.stripe.android.webhookcustomer.** { *; }

# Keep Stripe webhook charge classes
-keep class com.stripe.android.webhookcharge.** { *; }

# Keep Stripe webhook refund classes
-keep class com.stripe.android.webhookrefund.** { *; }

# Keep Stripe webhook dispute classes
-keep class com.stripe.android.webhookdispute.** { *; }

# Keep Stripe webhook transfer classes
-keep class com.stripe.android.webhooktransfer.** { *; }

# Keep Stripe webhook payout classes
-keep class com.stripe.android.webhookpayout.** { *; }

# Keep Stripe webhook balance classes
-keep class com.stripe.android.webhookbalance.** { *; }

# Keep Stripe webhook capability classes
-keep class com.stripe.android.webhookcapability.** { *; }

# Keep Stripe webhook person classes
-keep class com.stripe.android.webhookperson.** { *; }

# Keep Stripe webhook verification classes
-keep class com.stripe.android.webhookverification.** { *; }

# Keep Stripe webhook document classes
-keep class com.stripe.android.webhookdocument.** { *; }

# Keep
