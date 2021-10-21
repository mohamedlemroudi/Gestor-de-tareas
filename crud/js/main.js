const d = document,
    $table = d.querySelector('.crud-table'),
    $form = d.querySelector('.crud-form'),
    $template = d.querySelector('.plantilla').content,
    $fragment = d.createDocumentFragment();

const modo_noche = d.querySelector('.nigth_modo');

// Ferem servir la llibreria Axios per manipular les dades que tenim en el fitxer db.json

const getTask = async () => {
    try{
        let res = await axios.get('http://localhost:5554/assignatures'),
            json = await res.data;

        console.log('Hola mundo');

        json.forEach((el) => {
            // Imprimir en pantalla contenido actual
            $template.querySelector('.deberes').textContent = el.deberes;
            $template.querySelector('.data').textContent = el.data;
            $template.querySelector('.dificultad').textContent = el.dificultad;

            // Agregar atributo para button editar
            $template.querySelector('.edit').dataset.id = el.id;
            $template.querySelector('.edit').dataset.deberes = el.deberes;
            $template.querySelector('.edit').dataset.data = el.data;
            $template.querySelector('.edit').dataset.dificultad = el.dificultad;

            // Agregar atributo id, al boton de eliminar para identificar elemento a eliminar
            $template.querySelector('.delete').dataset.id = el.id;

            // Clonació
            let $clone = d.importNode($template, true);
            // Injecció en l'element fragment
            $fragment.appendChild($clone);
        })
        $table.querySelector('tbody').appendChild($fragment);

    } catch(err){
        let message = err.statusText || 'Ocurrió un error 1';
        $table.insertAdjacentHTML('afterend',`<p><b>${err.status}: ${message}</b></p>`)
    }
}

d.addEventListener('DOMContentLoaded',getTask);


d.addEventListener('submit', async (e) => {
    if(e.target === $form){
        e.preventDefault();

        // Datos a enviar
        datos = {
            deberes: e.target.deberes.value,
            data: e.target.data.value,
            dificultad: e.target.dificultad.value
        }

        if(e.target.id.value == 0 || !e.target.id.value){
            // Create - POST
            try{
                let options = {
                    method: 'POST',
                    data: JSON.stringify(datos),
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    }
                }

                let res = await axios('http://localhost:5554/assignatures',options);

                let json = await res.data;

                location.reload();
            } catch(err){
                let message = err.statusText || 'Ocurrió un error 2';
                $form.insertAdjacentElement('afterend',`<p><b>${err.status}: ${message}</b></p>`)

            }
        }else{
            // Update - PUT
            try{
                let options = {
                    method: 'PUT',
                    data: JSON.stringify(datos),
                    headers: {
                        'Content-Type':'application/json'
                    }
                }

                let res = await axios(`http://localhost:5554/assignatures/${e.target.id.value}`,options);

                let json = await res.data;

                $form.id.value = 0;

                location.reload();
            }catch (err){
                let message = err.statusText || 'Ocurrió un error';
                $form.insertAdjacentHTML('afterend',`<p><b>Error: ${err.message}: ${message}</b></p>`)
            }
        }

    }
})


d.addEventListener('click', async (e) => {
    // Boton de Editar
    if(e.target.matches('.edit')){
        // Añadimos contenido el elemento escondido, para que despues verificamos si estamos haciendo POST o un PUT
        $form.id.value = e.target.dataset.id;
        $form.deberes.value = e.target.dataset.deberes;
        $form.data.value = e.target.dataset.data;
        $form.dificultad.value = e.target.dataset.dificultad;
    }  

    console.log($form.id.value);

    // Botón de Eliminar
    if(e.target.matches('.delete')){
        let isDelete = confirm(
            `¿Estás seguro que quiere eliminar la task?`
        );

        if(isDelete){
            // Delete - DELETE
            try{
                let options = {
                    method: 'DELETE',
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                },
                    res = await axios(`http://localhost:5554/assignatures/${e.target.dataset.id}`, options),
                    json = await res.data;

                location.reload();
            }catch(err){
                let message = err.statusText || 'Ocurrió un error';
                alert(`Error ${err.status}: ${message}`);
            }
        } 
    }

    // Modo Noche
    if(e.target.matches('.nigth_modo i')){
        d.querySelector('body').classList.toggle('modo-oscuro');
        d.querySelector('table').classList.toggle('modo-oscuro');
    }
})
