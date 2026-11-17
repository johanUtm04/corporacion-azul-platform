document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('ca-brand-logo-select')
  const input = document.getElementById('ca_brand_logo_id')
  const preview = document.getElementById('ca-brand-logo-preview')

  if (!button || !input || !preview || !window.wp?.media) {
    return
  }

  let mediaFrame

  button.addEventListener('click', () => {
    if (!mediaFrame) {
      mediaFrame = window.wp.media({
        title: 'Seleccionar logotipo de la marca',
        button: {
          text: 'Usar este logotipo',
        },
        library: {
          type: 'image',
        },
        multiple: false,
      })

      mediaFrame.on('select', () => {
        const attachment = mediaFrame
          .state()
          .get('selection')
          .first()
          ?.toJSON()

        if (!attachment) return

        input.value = String(attachment.id)

        const image = document.createElement('img')
        image.src = attachment.sizes?.thumbnail?.url || attachment.url
        image.alt = ''
        image.style.maxWidth = '120px'
        image.style.height = 'auto'

        preview.replaceChildren(image)
      })
    }

    mediaFrame.open()
  })
})