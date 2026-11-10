import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { VStack, HStack, Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Section } from '@astryxdesign/core/Section';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { useLightbox } from '@astryxdesign/core/Lightbox';
import { TopNav, TopNavItem } from '@astryxdesign/core/TopNav';
import { MobileNav } from '@astryxdesign/core/MobileNav';
import { SideNavItem } from '@astryxdesign/core/SideNav';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Link } from '@astryxdesign/core/Link';
import { Theme } from '@astryxdesign/core/theme';
import { themes } from './astryx-themes';
import { content } from './content';

const image = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;
const whatsapp = 'https://wa.me/553333314530';
const frame: CSSProperties = { maxWidth: 'var(--nt-page-width)', marginInline: 'auto', width: '100%' };
const photo: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-container)' };
const navTarget: CSSProperties = { minHeight: 'var(--spacing-11)' };
const services = ['Corretora de café', 'Assessoria rural', 'Suporte para exportação de café', 'Cursos de especialização', 'Laudos de cafés especiais', 'Excursões internacionais', 'Treinamento profissional'];

function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <Button label="Menu" size="lg" aria-expanded={isOpen} aria-controls="navegacao-movel" aria-haspopup="dialog" onClick={() => setIsOpen(true)} />
    <MobileNav id="navegacao-movel" isOpen={isOpen} onOpenChange={setIsOpen} header="Navegação principal">
      <VStack gap={2}>
        <SideNavItem href="#servicos" label="Serviços" size="lg" onClick={() => setIsOpen(false)} />
        <SideNavItem href="#quem-somos" label="Quem somos" size="lg" onClick={() => setIsOpen(false)} />
        <SideNavItem href="#contato" label="Contato" size="lg" onClick={() => setIsOpen(false)} />
      </VStack>
    </MobileNav>
  </>;
}

function Region({ id, title, eyebrow, children, dark = false }: { id: string; title: string; eyebrow: string; children: ReactNode; dark?: boolean }) {
  const section = <VStack as="section" id={id} aria-labelledby={`${id}-titulo`} paddingBlock={10} paddingInline={6} gap={8} style={frame}>
    <VStack gap={3}><Text type="label" color="secondary">{eyebrow}</Text><Heading level={2} id={`${id}-titulo`} textWrap="balance">{title}</Heading></VStack>
    {children}
  </VStack>;
  return dark ? <Theme theme={themes['novo-tempo']} mode="dark"><Section padding={0}>{section}</Section></Theme> : section;
}

export default function App() {
  const isMobile = useMediaQuery('(width < 640px)');
  const media = content.gallery.map(item => ({ src: image(item.file), alt: item.alt, caption: item.alt }));
  const gallery = useLightbox({ media, hasZoom: true });

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const tokens = getComputedStyle(entry.target);
        animations.push(entry.target.animate([
          { opacity: 0.5, transform: 'translateY(var(--spacing-3))' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 250, easing: tokens.getPropertyValue('--ease-entrance').trim() || 'ease-out' }));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('main section').forEach(section => observer.observe(section));
    const stop = () => { if (preference.matches) { observer.disconnect(); animations.forEach(animation => animation.cancel()); } };
    preference.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener('change', stop); };
  }, []);

  return <Theme theme={themes['novo-tempo']} mode="light">
    <VStack gap={0} style={{ backgroundColor: 'var(--color-background-body)' }}>
      <HStack as="header" paddingInline={isMobile ? 3 : 6} paddingBlock={3} style={{ ...frame, '--size-element-md': 'var(--spacing-11)', '--size-element-lg': 'var(--spacing-11)' } as CSSProperties}>
        <TopNav label="Navegação principal" heading={<Link href="#inicio" aria-label="Novo Tempo Café — início"><HStack gap={3} vAlign="center"><img src={image('icons/iconeLogo.svg')} width="44" height="44" alt="Logo Novo Tempo Café" /><Text type="label">NOVO TEMPO CAFÉ</Text></HStack></Link>}
          endContent={isMobile ? <MobileNavigation /> : <HStack gap={1} wrap="wrap"><TopNavItem href="#servicos" label="Serviços" style={navTarget} /><TopNavItem href="#quem-somos" label="Quem somos" style={navTarget} /><TopNavItem href="#contato" label="Contato" style={navTarget} /></HStack>} />
      </HStack>
      <Layout height="auto" content={<LayoutContent padding={0} isScrollable={false}>
        <VStack as="main" id="conteudo" gap={0}>
          <VStack as="section" id="inicio" aria-labelledby="hero-titulo" padding={6} gap={10} style={frame}>
            <VStack gap={6} hAlign="center" paddingBlock={6}>
              <VStack gap={3} hAlign="center" maxWidth="var(--nt-reading-width)">
                <Text type="label" color="secondary" justify="center">CORRETORA DE CAFÉ · ASSESSORIA RURAL · EXPORTAÇÃO</Text>
                <Heading level={1} id="hero-titulo" type="display-2" justify="center" textWrap="balance">Novo Tempo Café</Heading>
                <Text as="p" type="large" color="secondary" justify="center" textWrap="balance">Corretora de café, assessoria rural e suporte para exportação de café.</Text>
              </VStack>
              <HStack gap={3} wrap="wrap" hAlign="center"><Button label="Fale pelo WhatsApp" href={whatsapp} variant="primary" size="lg" /><Button label="Nossos serviços" href="#servicos" size="lg" /></HStack>
            </VStack>
            <Grid columns={{ minWidth: 140, max: 2 }} gap={4}>
              <img src={image('imagensIndex/imagemPrincipal.webp')} alt="Grãos de café da Novo Tempo Café" width="1600" height="839" fetchPriority="high" style={{ ...photo, aspectRatio: '16 / 11' }} />
              <VStack as="figure" gap={3}>
                <img src={image('imagensIndex/imgSection2.webp')} alt="Giovani e Bruno na Semana Internacional do Café" width="1000" height="750" style={{ ...photo, aspectRatio: '16 / 11', height: 'auto' }} />
                <Text type="supporting" justify="center">Semana Internacional do Café 🌱🍒☕️🤝🌍</Text>
              </VStack>
            </Grid>
          </VStack>
          <Region id="servicos" eyebrow="O QUE FAZEMOS" title="Nossos serviços">
            <Grid columns={{ minWidth: 260, max: 3 }} gap={6}>
              {services.map((service, index) => <VStack key={service} gap={3} paddingBlock={4} style={{ borderTop: 'var(--border-width) solid var(--color-border-emphasized)' }}><Text type="supporting" color="secondary">0{index + 1}</Text><Heading level={3}>{service}</Heading></VStack>)}
            </Grid>
          </Region>
          <Region id="quem-somos" eyebrow="QUEM SOMOS" title="Novo Tempo Café" dark>
            <Grid columns={{ minWidth: 280, max: 2 }} gap={10}>
              <VStack gap={6}>
                <Text as="p" type="large">Novo Tempo Café é uma empresa que atua no ramo de cafés especiais, oferecendo cursos, consultorias e corretagem de café.</Text>
                <VStack as="blockquote" gap={3} style={{ margin: 0, borderInlineStart: 'var(--spacing-1) solid var(--color-accent)', paddingInlineStart: 'var(--spacing-6)' }}><Text type="display-3">“As coisas velhas já passaram; eis que tudo se fez novo.”</Text><Text type="supporting">II Coríntios 5:17</Text></VStack>
              </VStack>
              <VStack gap={6}>
                <VStack gap={2}><Heading level={3}>Missão</Heading><Text as="p">Proporcionar soluções inovadoras e personalizadas para o crescimento dos negócios.</Text></VStack>
                <VStack gap={2}><Heading level={3}>Visão</Heading><Text as="p">Ser líder de mercado, expandir serviços e promover desenvolvimento sustentável do setor cafeeiro.</Text></VStack>
                <VStack gap={2}><Heading level={3}>Valores</Heading><Text as="p">Excelência, Transparência, integridade, responsabilidade, inovação e trabalho em equipe.</Text></VStack>
              </VStack>
            </Grid>
          </Region>
          <Region id="diretores" eyebrow="GENTE QUE FAZ A NOVO TEMPO" title="Diretores executivos">
            <Grid columns={{ minWidth: 280, max: 2 }} gap={8}>
              {['Giovani Gomes', 'Bruno Sathler'].map((name, index) => <Card key={name} padding={0}><VStack gap={0}>
                <img src={image(`imagensIndex/${index === 0 ? 'ceoGiovani' : 'ceoBruno'}.webp`)} alt={`${name}, diretor executivo da Novo Tempo Café`} width="700" height={index === 0 ? 797 : 843} loading="lazy" decoding="async" style={{ ...photo, aspectRatio: '4 / 4', height: 'auto', objectPosition: 'center 25%' }} />
                <VStack padding={6} gap={4}><Heading level={3}>{name}</Heading><Text as="p" color="secondary">{content.quotes[index]}</Text></VStack>
              </VStack></Card>)}
            </Grid>
          </Region>
          <Region id="galeria" eyebrow="NOSSO DIA A DIA" title="Café, encontros e caminhos">
            <Grid columns={{ minWidth: 140, max: 4 }} gap={4}>{media.map((item, index) => <img key={item.src} {...gallery.getTriggerProps(index)} src={item.src} alt={item.alt} width="500" height="493" loading="lazy" decoding="async" style={{ ...photo, aspectRatio: '1', cursor: 'zoom-in' }} />)}</Grid>
            <Link href="https://www.instagram.com/novotempocafe/" target="_blank" rel="noreferrer">@novotempocafe no Instagram ↗</Link>
            {gallery.element}
          </Region>
          <Region id="perguntas" eyebrow="TIRE SUAS DÚVIDAS" title="Perguntas frequentes">
            <CollapsibleGroup type="multiple" hasDividers>{content.faq.map((faq, index) => <Collapsible key={faq.question} value={String(index)} trigger={faq.question}><Text as="p" color="secondary">{faq.answer}</Text></Collapsible>)}</CollapsibleGroup>
          </Region>
          <Region id="contato" eyebrow="LOCALIZAÇÃO + CONTATO" title="Fale com a Novo Tempo" dark>
            <Grid columns={{ minWidth: 280, max: 2 }} gap={8}>
              <VStack as="address" gap={6} style={{ fontStyle: 'normal' }}>
                <Link href={content.directions} target="_blank" rel="noreferrer">Av. Felipe Nacif, 34 - 2° Andar<br />Manhuaçu, Minas Gerais, Brasil</Link>
                <Link href="tel:553333314530">+55 (33) 3331-4530</Link><Link href="mailto:novotempocafe@hotmail.com">novotempocafe@hotmail.com</Link><Link href="https://www.instagram.com/novotempocafe/" target="_blank" rel="noreferrer">@novotempocafe</Link>
                <HStack><Button href={whatsapp} label="Converse pelo WhatsApp" variant="primary" size="lg" /></HStack>
              </VStack>
              <iframe title="Localização da Novo Tempo Café no Google Maps" src={content.map} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', minHeight: 'var(--nt-map-height)', border: 0, borderRadius: 'var(--radius-container)' }} />
            </Grid>
          </Region>
        </VStack>
      </LayoutContent>} />
      <VStack as="footer" padding={6} gap={4} style={frame}>
        <HStack hAlign="between" vAlign="center" wrap="wrap" gap={4}><Text type="supporting">Novo Tempo Café © 2013</Text><HStack gap={4} wrap="wrap"><Link href="#inicio">Início</Link><Link href="#quem-somos">Sobre nós</Link><Link href="#contato">Contato</Link></HStack></HStack>
        <Text type="supporting">Feito por <Link href="https://github.com/Venidici-Org" target="_blank" rel="noreferrer">Venidici</Link></Text>
      </VStack>
    </VStack>
  </Theme>;
}

