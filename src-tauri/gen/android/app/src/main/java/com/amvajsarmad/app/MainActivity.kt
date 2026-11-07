package com.amvajsarmad.app

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.Gravity
import android.view.View
import android.webkit.CookieManager
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var errorLayout: LinearLayout
    private lateinit var btnRetry: Button
    private lateinit var tvErrorTitle: TextView
    private lateinit var tvErrorDesc: TextView

    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var cameraImageUri: Uri? = null

    private lateinit var filePickerLauncher: ActivityResultLauncher<Intent>

    private val targetUrl = "https://amvajsarmad.com"
    private var isOffline = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildDynamicLayout())

        setupActivityLaunchers()
        setupWebView()
        setupBackNavigation()
        setupNetworkMonitoring()

        if (isNetworkAvailable()) {
            loadTargetWebsite(targetUrl)
        } else {
            showErrorState(
                getString(R.string.error_no_internet_title),
                getString(R.string.error_no_internet_msg)
            )
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            userAgentString = "${settings.userAgentString ?: ""} AmvajSarmadAndroidApp/1.0.0"
        }

        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        swipeRefresh.setColorSchemeResources(R.color.primary)
        swipeRefresh.setOnRefreshListener {
            if (isNetworkAvailable()) {
                hideErrorState()
                webView.reload()
            } else {
                swipeRefresh.isRefreshing = false
                showErrorState(
                    getString(R.string.error_no_internet_title),
                    getString(R.string.error_no_internet_msg)
                )
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                return handleUrlNavigation(url)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
                CookieManager.getInstance().flush()
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    progressBar.visibility = View.GONE
                    swipeRefresh.isRefreshing = false
                    showErrorState(
                        getString(R.string.error_server_title),
                        getString(R.string.error_server_msg)
                    )
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                openFileSelector()
                return true
            }
        }

        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, _ ->
            handleDownload(url, userAgent, contentDisposition, mimetype)
        }

        btnRetry.setOnClickListener {
            if (isNetworkAvailable()) {
                hideErrorState()
                progressBar.visibility = View.VISIBLE
                webView.reload()
            } else {
                Toast.makeText(
                    this,
                    R.string.error_no_internet_msg,
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun handleUrlNavigation(url: String): Boolean {
        val uri = Uri.parse(url)
        val host = uri.host?.lowercase(Locale.ROOT) ?: ""

        if (url.startsWith("tel:") || url.startsWith("mailto:") ||
            url.startsWith("sms:") || url.startsWith("whatsapp:") ||
            url.startsWith("tg:")
        ) {
            try {
                startActivity(Intent(Intent.ACTION_VIEW, uri))
            } catch (e: Exception) {
                Toast.makeText(this, "برنامه‌ای برای باز کردن این پیوند یافت نشد", Toast.LENGTH_SHORT).show()
            }
            return true
        }

        val isBankingGateway = host.endsWith("shaparak.ir") ||
                host.contains("zarinpal.com") ||
                host.contains("idpay.ir") ||
                host.contains("pay.ir") ||
                host.contains("nextpay.org") ||
                host.contains("sadadpsp.ir") ||
                host.contains("asanpardakht.ir")

        val isInternalDomain = host == "amvajsarmad.com" || host.endsWith(".amvajsarmad.com")

        return if (isInternalDomain || isBankingGateway) {
            false
        } else {
            try {
                val intent = Intent(Intent.ACTION_VIEW, uri)
                startActivity(intent)
            } catch (e: Exception) {
                // Ignore if no browser available
            }
            true
        }
    }

    private fun handleDownload(
        url: String?,
        userAgent: String?,
        contentDisposition: String?,
        mimeType: String?
    ) {
        if (url.isNullOrEmpty()) return
        try {
            val request = DownloadManager.Request(Uri.parse(url))
            val filename = URLUtil.guessFileName(url, contentDisposition, mimeType)

            val cookies = CookieManager.getInstance().getCookie(url)
            if (!cookies.isNullOrEmpty()) {
                request.addRequestHeader("cookie", cookies)
            }
            if (!userAgent.isNullOrEmpty()) {
                request.addRequestHeader("User-Agent", userAgent)
            }
            request.setDescription(getString(R.string.download_started))
            request.setTitle(filename)
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename)

            val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)

            Toast.makeText(this, getString(R.string.download_started), Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "خطا در شروع دانلود: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (errorLayout.visibility == View.VISIBLE && webView.canGoBack()) {
                    hideErrorState()
                    webView.goBack()
                } else if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun setupActivityLaunchers() {
        filePickerLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            val data = result.data
            var results: Array<Uri>? = null
            if (result.resultCode == RESULT_OK) {
                if (data != null && data.data != null) {
                    results = arrayOf(data.data!!)
                } else if (cameraImageUri != null) {
                    results = arrayOf(cameraImageUri!!)
                }
            }
            fileUploadCallback?.onReceiveValue(results)
            fileUploadCallback = null
        }
    }

    private fun openFileSelector() {
        val galleryIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
            putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "application/pdf"))
        }

        val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        if (cameraIntent.resolveActivity(packageManager) != null) {
            val photoFile: File? = try {
                createImageFile()
            } catch (ex: IOException) {
                null
            }
            if (photoFile != null) {
                cameraImageUri = FileProvider.getUriForFile(
                    this,
                    "${applicationContext.packageName}.fileprovider",
                    photoFile
                )
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri)
            }
        }

        val chooser = Intent.createChooser(galleryIntent, "انتخاب فایل یا عکس")
        if (cameraIntent.resolveActivity(packageManager) != null && cameraImageUri != null) {
            chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(cameraIntent))
        }

        filePickerLauncher.launch(chooser)
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile("JPEG_${timeStamp}_", ".jpg", storageDir)
    }

    private fun setupNetworkMonitoring() {
        val connectivityManager =
            getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(
            request,
            object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    runOnUiThread {
                        if (isOffline) {
                            isOffline = false
                            if (errorLayout.visibility == View.VISIBLE) {
                                hideErrorState()
                                webView.reload()
                            }
                        }
                    }
                }

                override fun onLost(network: Network) {
                    runOnUiThread {
                        isOffline = true
                    }
                }
            }
        )
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(activeNetwork) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun loadTargetWebsite(url: String) {
        hideErrorState()
        webView.loadUrl(url)
    }

    private fun showErrorState(title: String, desc: String) {
        tvErrorTitle.text = title
        tvErrorDesc.text = desc
        errorLayout.visibility = View.VISIBLE
        webView.visibility = View.GONE
    }

    private fun hideErrorState() {
        errorLayout.visibility = View.GONE
        webView.visibility = View.VISIBLE
    }

    private fun buildDynamicLayout(): View {
        val root = ConstraintLayout(this).apply {
            layoutParams = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.MATCH_PARENT
            )
        }

        swipeRefresh = SwipeRefreshLayout(this).apply {
            id = View.generateViewId()
            layoutParams = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.MATCH_PARENT
            )
        }

        webView = WebView(this).apply {
            id = View.generateViewId()
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }
        swipeRefresh.addView(webView)
        root.addView(swipeRefresh)

        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            id = View.generateViewId()
            max = 100
            progressDrawable?.setTint(ContextCompat.getColor(this@MainActivity, R.color.primary))
            val lp = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                8
            )
            lp.topToTop = ConstraintLayout.LayoutParams.PARENT_ID
            layoutParams = lp
        }
        root.addView(progressBar)

        errorLayout = LinearLayout(this).apply {
            id = View.generateViewId()
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.background_light))
            visibility = View.GONE
            setPadding(48, 48, 48, 48)
            val lp = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.MATCH_PARENT
            )
            layoutParams = lp
        }

        tvErrorTitle = TextView(this).apply {
            textSize = 20f
            setTextColor(ContextCompat.getColor(this@MainActivity, R.color.text_primary))
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 16)
        }
        errorLayout.addView(tvErrorTitle)

        tvErrorDesc = TextView(this).apply {
            textSize = 14f
            setTextColor(ContextCompat.getColor(this@MainActivity, R.color.text_secondary))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 32)
        }
        errorLayout.addView(tvErrorDesc)

        btnRetry = Button(this).apply {
            text = getString(R.string.btn_retry)
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.primary))
            setTextColor(ContextCompat.getColor(this@MainActivity, R.color.surface))
        }
        errorLayout.addView(btnRetry)

        root.addView(errorLayout)
        return root
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        CookieManager.getInstance().flush()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
        CookieManager.getInstance().flush()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
